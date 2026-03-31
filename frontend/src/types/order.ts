export type OrderStatus = 'PLACED' | 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';

export interface Order {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  createdDate: string;
}

export interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}
