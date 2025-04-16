export interface OrderItemInput {
    productId: string;
    quantity: number;
  }
  
 export interface CreateOrderInput {
    storeId: string;
    isPaid: boolean;
    phone: string;
    username: string;
    address: string;
    note?: string;
    paymentMethod?: string;
    orderItems: OrderItemInput[];
  }


