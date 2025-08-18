export type OrderStatus = 
  | 'Confirmed' 
  | 'Approved' 
  | 'Preparing' 
  | 'Ready for Pickup' 
  | 'Dispatched' 
  | 'Fulfilled' 
  | 'Cancelled';

export type OrderChannel = 'USSD' | 'Mobile Web' | 'Field Agent';

export interface OrderItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PaymentInfo {
  method: 'Cash' | 'Mobile Money' | 'Bank Transfer' | 'Credit';
  amount: number;
  transactionId?: string;
  status: 'Pending' | 'Completed' | 'Failed';
  paidAt?: string;
}

export interface CustomerInfo {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  location: {
    lat?: number;
    lng?: number;
    region: string;
    district: string;
  };
}

export interface WarehouseInfo {
  id: string;
  name: string;
  code: string;
  address: string;
  manager: string;
  phone: string;
}

export interface Order {
  id: string;
  orderNo: string;
  date: string;
  time: string;
  customer: CustomerInfo;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  channel: OrderChannel;
  payment: PaymentInfo;
  warehouse?: WarehouseInfo;
  eta?: string;
  assignedAt?: string;
  assignedBy?: string;
  issuedAt?: string;
  dispatchedAt?: string;
  fulfilledAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  notes?: string;
}

export interface OrderFilters {
  status?: OrderStatus[];
  dateFrom?: string;
  dateTo?: string;
  customer?: string;
  warehouse?: string;
  channel?: OrderChannel[];
}

export interface OrderStats {
  total: number;
  confirmed: number;
  approved: number;
  preparing: number;
  readyForPickup: number;
  dispatched: number;
  fulfilled: number;
  cancelled: number;
}