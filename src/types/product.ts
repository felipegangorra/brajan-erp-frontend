export type ProductUnit = 'un' | 'kg' | 'cx' | 'm' | 'l';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: ProductUnit;
  stock: number;
  active: boolean;
  createdAt: string;
}