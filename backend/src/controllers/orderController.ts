import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import asyncHandler from "express-async-handler";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { User } from "../models/User";
import AppError from "../utils/appError";
import { Email } from "../utils/email";
import Stripe from "stripe";
import { getIO } from "../sockets/socketController";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

// @desc    Criar novo pedido a partir do carrinho
// @route   POST /api/orders
// @access  Privado
export const createOrder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new AppError("O carrinho está vazio", 400);
    }

    let itemsPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new AppError(`Produto não encontrado: ${item.productId}`, 404);
      }
      if (product.stock < item.quantity) {
        throw new AppError(`Estoque insuficiente para ${product.name}`, 400);
      }
      itemsPrice += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
      });
    }

    const taxPrice = itemsPrice * 0.15;
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const order = await Order.create({
      user: req.user?._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      status: "pending",
      isPaid: false,
      isDelivered: false,
    });

    // Atualizar estoque
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json({
      status: "sucesso",
      data: order,
    });
  },
);

// @desc    Obter pedido por ID
// @route   GET /api/orders/:id
// @access  Privado
export const getOrder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name price images");

    if (!order) {
      throw new AppError("Pedido não encontrado", 404);
    }

    // Verificar que o usuário seja o proprietário do pedido ou um admin
    if (
      order.user._id.toString() !== req.user?._id?.toString() &&
      req.user?.role !== "admin"
    ) {
      throw new AppError("Não autorizado", 403);
    }

    res.status(200).json({
      status: "sucesso",
      data: order,
    });
  },
);

// @desc    Atualizar pedido para pago
// @route   PUT /api/orders/:id/pay
// @access  Privado
export const updateOrderToPaid = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AppError("Pedido não encontrado", 404);
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      updateTime: req.body.update_time,
      email: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    // Emitir evento de socket
    getIO().emit("orderPaid", { order: updatedOrder });

    // Enviar email de confirmação de pagamento
    const user = await User.findById(order.user);
    if (user) {
      await new Email(
        user,
        `${process.env.FRONTEND_URL}/order/${order._id}`,
      ).sendOrderStatusUpdate(updatedOrder);
    }

    res.status(200).json({
      status: "sucesso",
      data: updatedOrder,
    });
  },
);

// @desc    Atualizar pedido para entregue
// @route   PUT /api/orders/:id/deliver
// @access  Privado/Admin
export const updateOrderToDelivered = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AppError("Pedido não encontrado", 404);
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();
    order.status = "completed";

    const updatedOrder = await order.save();

    // Emitir evento de socket
    getIO().emit("orderDelivered", { order: updatedOrder });

    // Enviar email de confirmação de entrega
    const user = await User.findById(order.user);
    if (user) {
      await new Email(
        user,
        `${process.env.FRONTEND_URL}/order/${order._id}`,
      ).sendOrderStatusUpdate(updatedOrder);
    }

    res.status(200).json({
      status: "sucesso",
      data: updatedOrder,
    });
  },
);

// @desc    Obter pedidos do usuário logado
// @route   GET /api/orders/myorders
// @access  Privado
export const getMyOrders = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user?._id })
      .populate("orderItems.product", "name price images")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ user: req.user?._id });
    const pages = Math.ceil(total / limit);

    res.status(200).json({
      status: "sucesso",
      results: orders.length,
      pagination: {
        current: page,
        pages,
        total,
      },
      data: orders,
    });
  },
);

// @desc    Obter todos os pedidos
// @route   GET /api/orders
// @access  Privado/Admin
export const getAllOrders = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const query: any = {};

    // Filtros
    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.isPaid) {
      query.isPaid = req.query.isPaid === "true";
    }

    if (req.query.isDelivered) {
      query.isDelivered = req.query.isDelivered === "true";
    }

    // Faixa de datas
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) {
        query.createdAt.$gte = new Date(req.query.startDate as string);
      }
      if (req.query.endDate) {
        query.createdAt.$lte = new Date(req.query.endDate as string);
      }
    }

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("orderItems.product", "name price")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);
    const pages = Math.ceil(total / limit);

    // Calcular estatísticas
    const stats = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSales: { $sum: "$totalPrice" },
          avgOrderValue: { $avg: "$totalPrice" },
        },
      },
    ]);

    res.status(200).json({
      status: "sucesso",
      results: orders.length,
      pagination: {
        current: page,
        pages,
        total,
      },
      stats: stats[0] || {
        totalOrders: 0,
        totalSales: 0,
        avgOrderValue: 0,
      },
      data: orders,
    });
  },
);

// @desc    Excluir pedido
// @route   DELETE /api/orders/:id
// @access  Privado/Admin
export const deleteOrder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AppError("Pedido não encontrado", 404);
    }

    // Se o pedido estiver pago, reembolsar
    if (order.isPaid && order.paymentMethod === "card") {
      // Implementar lógica de reembolso com Stripe
      // const refund = await stripe.refunds.create({
      //   payment_intent: order.paymentResult.id,
      // });
    }

    // Restaurar estoque
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    await Order.findByIdAndDelete(order._id);

    // Emitir evento de socket
    getIO().emit("orderDeleted", { orderId: req.params.id });

    res.status(204).json({
      status: "sucesso",
      data: null,
    });
  },
);

// @desc    Criar sessão de checkout de Stripe
// @route   POST /api/orders/create-checkout-session
// @access  Privado
export const createCheckoutSession = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { orderItems } = req.body;

    const lineItems = await Promise.all(
      orderItems.map(async (item: any) => {
        const product = await Product.findById(item.product);
        return {
          price_data: {
            currency: "brl",
            product_data: {
              name: product!.name,
              images: [product!.images[0]],
            },
            unit_amount: product!.price * 100,
          },
          quantity: item.quantity,
        };
      }),
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      customer_email: req.user?.email,
      client_reference_id: req.user?._id?.toString(),
      metadata: {
        orderId: req.body.orderId,
      },
    });

    res.status(200).json({
      status: "sucesso",
      data: session,
    });
  },
);

// @desc    Webhook handler para Stripe
// @route   POST /api/orders/webhook
// @access  Público
export const webhookHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err: any) {
      throw new AppError(`Webhook Error: ${err.message}`, 400);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        // Atualizar o pedido
        if (session.metadata?.orderId) {
          const order = await Order.findById(session.metadata.orderId);
          if (order) {
            order.isPaid = true;
            order.paidAt = new Date();
            order.paymentResult = {
              id: session.id,
              status: session.payment_status,
              updateTime: new Date().toISOString(),
              email: session.customer_details?.email || "",
            };
            await order.save();

            // Emitir evento de socket
            getIO().emit("orderPaid", { order });

            // Enviar email de confirmação
            const user = await User.findById(order.user);
            if (user) {
              await new Email(
                user,
                `${process.env.FRONTEND_URL}/order/${order._id}`,
              ).sendOrderStatusUpdate(order);
            }
          }
        }
        break;
      // Adicionar mais casos conforme necessário
    }

    res.status(200).json({ received: true });
  },
);
