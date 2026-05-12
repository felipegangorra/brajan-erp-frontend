export type PaymentMethodType =
  | 'money'
  | 'credit_card'
  | 'debit_card'
  | 'pix'
  | 'boleto';

export interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentMethodType;
  maxInstallments: number;
  active: boolean;
}