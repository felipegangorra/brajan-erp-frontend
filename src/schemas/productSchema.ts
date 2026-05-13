import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  description: z.string().optional(),
  unit: z.enum(['un', 'kg', 'cx', 'm', 'l']),
  price: z.number().positive('Preço deve ser maior que zero'),
  stock: z.number().min(0, 'Estoque deve ser maior ou igual a zero'),
  active: z.boolean(),
});

export type ProductFormData = z.infer<typeof productSchema>;