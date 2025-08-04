import Stripe from "stripe";
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-08-16",
});
export const createPaymentIntent = async (amount, currency = "brl") => {
    try {
        const paymentIntent = await stripeClient.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency,
        });
        return paymentIntent;
    }
    catch (error) {
        throw new Error(`Error creating payment intent: ${error.message}`);
    }
};
export const retrievePaymentIntent = async (paymentIntentId) => {
    try {
        const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);
        return paymentIntent;
    }
    catch (error) {
        throw new Error(`Error retrieving payment intent: ${error.message}`);
    }
};
export const createCustomer = async (email, source) => {
    try {
        const customer = await stripeClient.customers.create({
            email,
            source,
        });
        return customer;
    }
    catch (error) {
        throw new Error(`Error creating customer: ${error.message}`);
    }
};
export const createRefund = async (paymentIntentId, amount) => {
    try {
        const refund = await stripeClient.refunds.create({
            payment_intent: paymentIntentId,
            amount: amount ? Math.round(amount * 100) : undefined,
        });
        return refund;
    }
    catch (error) {
        throw new Error(`Error creating refund: ${error.message}`);
    }
};
export const createSubscription = async (customerId, priceId, options = {}) => {
    try {
        const subscription = await stripeClient.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            ...options,
        });
        return subscription;
    }
    catch (error) {
        throw new Error(`Error creating subscription: ${error.message}`);
    }
};
export const cancelSubscription = async (subscriptionId) => {
    try {
        const subscription = await stripeClient.subscriptions.cancel(subscriptionId);
        return subscription;
    }
    catch (error) {
        throw new Error(`Error canceling subscription: ${error.message}`);
    }
};
export const createProduct = async (name, options = {}) => {
    try {
        const product = await stripeClient.products.create({
            name,
            ...options,
        });
        return product;
    }
    catch (error) {
        throw new Error(`Error creating product: ${error.message}`);
    }
};
export const createPrice = async (productId, unitAmount, currency = "brl", options = {}) => {
    try {
        const price = await stripeClient.prices.create({
            product: productId,
            unit_amount: Math.round(unitAmount * 100),
            currency,
            ...options,
        });
        return price;
    }
    catch (error) {
        throw new Error(`Error creating price: ${error.message}`);
    }
};
export const createCheckoutSession = async (lineItems, options = {}) => {
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
    }
    catch (error) {
        throw new Error(`Error creating checkout session: ${error.message}`);
    }
};
export const createWebhookEvent = (payload, signature, webhookSecret) => {
    try {
        return stripeClient.webhooks.constructEvent(payload, signature, webhookSecret);
    }
    catch (error) {
        throw new Error(`Webhook error: ${error.message}`);
    }
};
export default stripeClient;
//# sourceMappingURL=stripeService.js.map