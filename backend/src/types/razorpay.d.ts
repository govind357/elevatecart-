declare module 'razorpay' {
  export interface RazorpayConstructorOptions {
    key_id: string;
    key_secret: string;
  }

  export interface OrderOptions {
    amount: number;
    currency: string;
    receipt: string;
    payment_capture: number;
    notes?: Record<string, any>;
  }

  export interface RazorpayOrder {
    id: string;
    entity: string;
    amount: number;
    amount_paid?: number;
    amount_due?: number;
    currency: string;
    receipt: string;
    status: string;
    attempts: number;
    notes?: Record<string, any>;
    [key: string]: any;
  }

  export default class Razorpay {
    constructor(options: RazorpayConstructorOptions);
    orders: {
      create(order: OrderOptions): Promise<RazorpayOrder>;
    };
  }
}
