export interface Order {
  id: string;
  date: string;
  orderNo: string;
  customerName: string;
  itemType: string;
  quantity: number;
  amount: number;
  status: 'Confirmed' | 'Paid';
  channel: 'USSD' | 'Mobile Web';
}

export interface Payment {
  id: string;
  date: string;
  time: string;
  orderNo: string;
  customerName: string;
  amount: number;
  method: 'Cash' | 'Mobile Money' | 'Bank Transfer';
}

export interface SalesData {
  month: string;
  currentYear: number;
  lastYear: number;
}

export interface CustomerSales {
  id: string;
  name: string;
  sales: number;
  orders: number;
}

export interface DashboardStats {
  totalOrders: number;
  totalPayments: number;
  totalRevenue: number;
  activeCustomers: number;
}