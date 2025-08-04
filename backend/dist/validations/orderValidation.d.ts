import { z } from 'zod';
export declare const createOrderSchema: z.ZodObject<{
    body: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            productId: z.ZodString;
            quantity: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            quantity: number;
            productId: string;
        }, {
            quantity: number;
            productId: string;
        }>, "atleastone">;
        shippingAddress: z.ZodObject<{
            address: z.ZodString;
            city: z.ZodString;
            postalCode: z.ZodString;
            country: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            address: string;
            city: string;
            postalCode: string;
            country: string;
        }, {
            address: string;
            city: string;
            postalCode: string;
            country: string;
        }>;
        paymentMethod: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        items: [{
            quantity: number;
            productId: string;
        }, ...{
            quantity: number;
            productId: string;
        }[]];
        shippingAddress: {
            address: string;
            city: string;
            postalCode: string;
            country: string;
        };
        paymentMethod: string;
    }, {
        items: [{
            quantity: number;
            productId: string;
        }, ...{
            quantity: number;
            productId: string;
        }[]];
        shippingAddress: {
            address: string;
            city: string;
            postalCode: string;
            country: string;
        };
        paymentMethod: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        items: [{
            quantity: number;
            productId: string;
        }, ...{
            quantity: number;
            productId: string;
        }[]];
        shippingAddress: {
            address: string;
            city: string;
            postalCode: string;
            country: string;
        };
        paymentMethod: string;
    };
}, {
    body: {
        items: [{
            quantity: number;
            productId: string;
        }, ...{
            quantity: number;
            productId: string;
        }[]];
        shippingAddress: {
            address: string;
            city: string;
            postalCode: string;
            country: string;
        };
        paymentMethod: string;
    };
}>;
export declare const createCheckoutSessionSchema: z.ZodObject<{
    body: z.ZodObject<{
        orderItems: z.ZodArray<z.ZodObject<{
            productId: z.ZodString;
            quantity: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            quantity: number;
            productId: string;
        }, {
            quantity: number;
            productId: string;
        }>, "atleastone">;
        orderId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        orderItems: [{
            quantity: number;
            productId: string;
        }, ...{
            quantity: number;
            productId: string;
        }[]];
        orderId?: string | undefined;
    }, {
        orderItems: [{
            quantity: number;
            productId: string;
        }, ...{
            quantity: number;
            productId: string;
        }[]];
        orderId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        orderItems: [{
            quantity: number;
            productId: string;
        }, ...{
            quantity: number;
            productId: string;
        }[]];
        orderId?: string | undefined;
    };
}, {
    body: {
        orderItems: [{
            quantity: number;
            productId: string;
        }, ...{
            quantity: number;
            productId: string;
        }[]];
        orderId?: string | undefined;
    };
}>;
