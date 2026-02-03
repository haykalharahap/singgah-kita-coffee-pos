
export type Category = 'All' | 'Coffee' | 'Non-Coffee';
export type Role = 'Cashier' | 'Admin';
export type OrderStatus = 'Pending' | 'Brewing' | 'Done';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  description: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  timestamp: Date;
  customerName?: string;
}

export interface SalesData {
  totalRevenue: number;
  orderCount: number;
  bestSeller: string;
}
