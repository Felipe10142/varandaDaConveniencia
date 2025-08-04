import { z } from 'zod';
export const createReviewSchema = z.object({
    body: z.object({
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
    }),
    params: z.object({
        productId: z.string(),
    }),
});
//# sourceMappingURL=reviewValidation.js.map