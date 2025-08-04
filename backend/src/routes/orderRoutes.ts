import express from "express";
import { validate } from "../middleware/validationMiddleware";
import { createOrderSchema, createCheckoutSessionSchema } from "../validations/orderValidation";
import {
  createOrder,
  getOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getAllOrders,
  deleteOrder,
  createCheckoutSession,
  webhookHandler,
} from "../controllers/orderController";

const router = express.Router();

// Rutas protegidas para usuarios autenticados
router.use(protect);

router.post("/", createOrder);
router.get("/myorders", getMyOrders);
router.get("/:id", getOrder);
router.post("/", validate(createOrderSchema), createOrder);
router.post("/create-checkout-session", validate(createCheckoutSessionSchema), createCheckoutSession);

// Ruta para el webhook de Stripe (no necesita autenticación)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhookHandler,
);

// Rutas protegidas para administradores
router.use(restrictTo("admin"));

router.get("/", getAllOrders);
router.put("/:id/pay", updateOrderToPaid);
router.put("/:id/deliver", updateOrderToDelivered);
router.delete("/:id", deleteOrder);

export default router;
