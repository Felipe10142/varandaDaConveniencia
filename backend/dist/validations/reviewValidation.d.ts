import { z } from 'zod';
export declare const createReviewSchema: z.ZodObject<{
    body: z.ZodObject<{
        rating: z.ZodNumber;
        comment: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        rating: number;
        comment?: string | undefined;
    }, {
        rating: number;
        comment?: string | undefined;
    }>;
    params: z.ZodObject<{
        productId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        productId: string;
    }, {
        productId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        productId: string;
    };
    body: {
        rating: number;
        comment?: string | undefined;
    };
}, {
    params: {
        productId: string;
    };
    body: {
        rating: number;
        comment?: string | undefined;
    };
}>;
