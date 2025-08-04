import { z } from 'zod';
export const createProductSchema = z.object({
    body: z.object({
        name: z.string({
            required_error: 'O nome do produto é obrigatório',
        }),
        price: z.number({
            required_error: 'O preço do produto é obrigatório',
        }).positive('O preço deve ser um número positivo'),
        description: z.string({
            required_error: 'A descrição do produto é obrigatória',
        }),
        category: z.string({
            required_error: 'A categoria do produto é obrigatória',
        }),
        stock: z.number().int().min(0, 'O estoque não pode ser negativo').optional(),
        isAvailable: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
    }),
});
export const updateProductSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        price: z.number().positive('O preço deve ser um número positivo').optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        stock: z.number().int().min(0, 'O estoque não pode ser negativo').optional(),
        isAvailable: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
        imagesToDelete: z.array(z.string()).optional(),
    }),
    params: z.object({
        id: z.string(),
    }),
});
//# sourceMappingURL=productValidation.js.map