import { z } from 'zod';
export declare const createProductSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        price: z.ZodNumber;
        description: z.ZodString;
        category: z.ZodString;
        stock: z.ZodOptional<z.ZodNumber>;
        isAvailable: z.ZodOptional<z.ZodBoolean>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        price: number;
        category: string;
        name: string;
        description: string;
        stock?: number | undefined;
        isAvailable?: boolean | undefined;
        tags?: string[] | undefined;
    }, {
        price: number;
        category: string;
        name: string;
        description: string;
        stock?: number | undefined;
        isAvailable?: boolean | undefined;
        tags?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        price: number;
        category: string;
        name: string;
        description: string;
        stock?: number | undefined;
        isAvailable?: boolean | undefined;
        tags?: string[] | undefined;
    };
}, {
    body: {
        price: number;
        category: string;
        name: string;
        description: string;
        stock?: number | undefined;
        isAvailable?: boolean | undefined;
        tags?: string[] | undefined;
    };
}>;
export declare const updateProductSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        price: z.ZodOptional<z.ZodNumber>;
        description: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        stock: z.ZodOptional<z.ZodNumber>;
        isAvailable: z.ZodOptional<z.ZodBoolean>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        imagesToDelete: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        price?: number | undefined;
        category?: string | undefined;
        stock?: number | undefined;
        name?: string | undefined;
        description?: string | undefined;
        isAvailable?: boolean | undefined;
        tags?: string[] | undefined;
        imagesToDelete?: string[] | undefined;
    }, {
        price?: number | undefined;
        category?: string | undefined;
        stock?: number | undefined;
        name?: string | undefined;
        description?: string | undefined;
        isAvailable?: boolean | undefined;
        tags?: string[] | undefined;
        imagesToDelete?: string[] | undefined;
    }>;
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        price?: number | undefined;
        category?: string | undefined;
        stock?: number | undefined;
        name?: string | undefined;
        description?: string | undefined;
        isAvailable?: boolean | undefined;
        tags?: string[] | undefined;
        imagesToDelete?: string[] | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        price?: number | undefined;
        category?: string | undefined;
        stock?: number | undefined;
        name?: string | undefined;
        description?: string | undefined;
        isAvailable?: boolean | undefined;
        tags?: string[] | undefined;
        imagesToDelete?: string[] | undefined;
    };
}>;
