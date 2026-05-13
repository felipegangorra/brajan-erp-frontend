import { z } from 'zod';

export const paymentMethodSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  type: z.enum(['money', 'credit_card', 'debit_card', 'pix', 'boleto']),
  maxInstallments: z
    .number()
    .int('Informe um número inteiro')
    .min(1, 'Mínimo de 1 parcela')
    .max(24, 'Máximo de 24 parcelas'),
  active: z.boolean(),
});

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;