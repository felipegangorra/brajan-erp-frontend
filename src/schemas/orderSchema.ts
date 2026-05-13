import { z } from 'zod';

export const orderItemFormSchema = z.object({
  productId: z.string().min(1, 'Selecione um produto'),
  quantity: z.number().min(1, 'Quantidade mínima é 1'),
  unitPrice: z.number().positive('Preço unitário deve ser maior que zero'),
});

export const orderStep1Schema = z.object({
  customerName: z.string().min(3, 'Mínimo 3 caracteres'),
  status: z.enum(['pending', 'approved']),
  items: z
    .array(orderItemFormSchema)
    .min(1, 'Adicione ao menos 1 item'),
});

export const orderPaymentFormSchema = z.object({
  paymentMethodId: z.string().min(1, 'Selecione uma forma de pagamento'),
  installments: z.number().int().min(1, 'Mínimo de 1 parcela'),
  amount: z.number().positive('Valor deve ser maior que zero'),
});

export const orderStep2Schema = z.object({
  payments: z
    .array(orderPaymentFormSchema)
    .min(1, 'Adicione ao menos um pagamento'),
});

export type OrderStep1FormData = z.infer<typeof orderStep1Schema>;
export type OrderStep2FormData = z.infer<typeof orderStep2Schema>;