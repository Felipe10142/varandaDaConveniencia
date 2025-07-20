import Stripe from "stripe";

// Initialize Stripe client
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

// Payment Intents
export const createPaymentIntent = async (
  amount: number,
  currency: string = "brl",
) => {
  try {
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe works in cents
      currency,
    });

    return paymentIntent;
  } catch (error: any) {
    throw new Error(`Error creating payment intent: ${error.message}`);
  }
};

export const retrievePaymentIntent = async (paymentIntentId: string) => {
  try {
    const paymentIntent =
      await stripeClient.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error: any) {
    throw new Error(`Error retrieving payment intent: ${error.message}`);
  }
};

// Customers
export const createCustomer = async (email: string, source?: string) => {
  try {
    const customer = await stripeClient.customers.create({
      email,
      source,
    });

    return customer;
  } catch (error: any) {
    throw new Error(`Error creating customer: ${error.message}`);
  }
};

// Refunds
export const createRefund = async (
  paymentIntentId: string,
  amount?: number,
) => {
  try {
    const refund = await stripeClient.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    });

    return refund;
  } catch (error: any) {
    throw new Error(`Error creating refund: ${error.message}`);
  }
};

// Subscriptions
export const createSubscription = async (
  customerId: string,
  priceId: string,
  options: Omit<Stripe.SubscriptionCreateParams, "customer" | "items"> = {},
) => {
  try {
    const subscription = await stripeClient.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      ...options,
    });

    return subscription;
  } catch (error: any) {
    throw new Error(`Error creating subscription: ${error.message}`);
  }
};

export const cancelSubscription = async (subscriptionId: string) => {
  try {
    const subscription =
      await stripeClient.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error: any) {
    throw new Error(`Error canceling subscription: ${error.message}`);
  }
};

// Products
export const createProduct = async (
  name: string,
  options: Omit<Stripe.ProductCreateParams, "name"> = {},
) => {
  try {
    const product = await stripeClient.products.create({
      name,
      ...options,
    });

    return product;
  } catch (error: any) {
    throw new Error(`Error creating product: ${error.message}`);
  }
};

// Prices
export const createPrice = async (
  productId: string,
  unitAmount: number,
  currency: string = "brl",
  options: Omit<
    Stripe.PriceCreateParams,
    "product" | "unit_amount" | "currency"
  > = {},
) => {
  try {
    const price = await stripeClient.prices.create({
      product: productId,
      unit_amount: Math.round(unitAmount * 100),
      currency,
      ...options,
    });

    return price;
  } catch (error: any) {
    throw new Error(`Error creating price: ${error.message}`);
  }
};

// Checkout Sessions
export const createCheckoutSession = async (
  lineItems: Array<Stripe.Checkout.SessionCreateParams.LineItem>,
  options: Partial<
    Omit<Stripe.Checkout.SessionCreateParams, "line_items">
  > = {},
) => {
  try {
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      ...options,
    });

    return session;
  } catch (error: any) {
    throw new Error(`Error creating checkout session: ${error.message}`);
  }
};

// Webhooks
export const createWebhookEvent = (
  payload: string | Buffer,
  signature: string,
  webhookSecret: string,
): Stripe.Event => {
  try {
    return stripeClient.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  } catch (error: any) {
    throw new Error(`Webhook error: ${error.message}`);
  }
};

export default stripeClient;
