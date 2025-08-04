import { z } from 'zod';
export const registerSchema = z.object({
    body: z.object({
        name: z.string({
            required_error: 'O nome é obrigatório',
        }).min(3, 'O nome precisa ter no mínimo 3 caracteres'),
        email: z.string({
            required_error: 'O email é obrigatório',
        }).email('Email inválido'),
        password: z.string({
            required_error: 'A senha é obrigatória',
        }).min(6, 'A senha precisa ter no mínimo 6 caracteres'),
    }),
});
export const loginSchema = z.object({
    body: z.object({
        email: z.string({
            required_error: 'O email é obrigatório',
        }).email('Email inválido'),
        password: z.string({
            required_error: 'A senha é obrigatória',
        }),
    }),
});
export const updateUserProfileSchema = z.object({
    body: z.object({
        name: z.string().min(3, 'O nome precisa ter no mínimo 3 caracteres').optional(),
        email: z.string().email('Email inválido').optional(),
        password: z.string().min(6, 'A senha precisa ter no mínimo 6 caracteres').optional(),
        address: z.string().optional(),
        phoneNumber: z.string().optional(),
    }),
});
export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string({
            required_error: 'O email é obrigatório',
        }).email('Email inválido'),
    }),
});
export const resetPasswordSchema = z.object({
    body: z.object({
        password: z.string({
            required_error: 'A senha é obrigatória',
        }).min(6, 'A senha precisa ter no mínimo 6 caracteres'),
    }),
    params: z.object({
        token: z.string({
            required_error: 'O token é obrigatório',
        }),
    }),
});
//# sourceMappingURL=userValidation.js.map