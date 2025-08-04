import { z } from 'zod';
const itemSchema = z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
});
const shippingAddressSchema = z.object({
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
});
export const createOrderSchema = z.object({
    body: z.object({
        items: z.array(itemSchema).nonempty(),
        shippingAddress: shippingAddressSchema,
        paymentMethod: z.string(),
    }),
});
export const createCheckoutSessionSchema = z.object({
    body: z.object({
        orderItems: z.array(itemSchema).nonempty(),
        orderId: z.string().optional(),
    }),
});
//# sourceMappingURL=orderValidation.js.map