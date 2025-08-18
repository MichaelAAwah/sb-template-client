import { Order, Payment, SalesData, CustomerSales, DashboardStats } from '../types/dashboard';

// Mock data generators
const generateRandomOrder = (index: number): Order => {
  const customers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown', 'Lisa Davis', 'Chris Taylor', 'Emma Jones'];
  const itemTypes = ['Electronics', 'Clothing', 'Food Items', 'Home Goods', 'Books', 'Sports Equipment'];
  const statuses: ('Confirmed' | 'Paid')[] = ['Confirmed', 'Paid'];
  const channels: ('USSD' | 'Mobile Web')[] = ['USSD', 'Mobile Web'];
  
  const date = new Date();
  date.setHours(date.getHours() - Math.floor(Math.random() * 24));
  
  return {
    id: `ORD-${1000 + index}`,
    date: date.toISOString().split('T')[0],
    orderNo: `ORD-${1000 + index}`,
    customerName: customers[Math.floor(Math.random() * customers.length)],
    itemType: itemTypes[Math.floor(Math.random() * itemTypes.length)],
    quantity: Math.floor(Math.random() * 10) + 1,
    amount: Math.floor(Math.random() * 500) + 50,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    channel: channels[Math.floor(Math.random() * channels.length)]
  };
};

const generateRandomPayment = (index: number): Payment => {
  const customers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
  const methods: ('Cash' | 'Mobile Money' | 'Bank Transfer')[] = ['Cash', 'Mobile Money', 'Bank Transfer'];
  
  const date = new Date();
  date.setHours(date.getHours() - Math.floor(Math.random() * 24));
  
  return {
    id: `PAY-${2000 + index}`,
    date: date.toISOString().split('T')[0],
    time: date.toTimeString().split(' ')[0].slice(0, 5),
    orderNo: `ORD-${1000 + index}`,
    customerName: customers[Math.floor(Math.random() * customers.length)],
    amount: Math.floor(Math.random() * 500) + 50,
    method: methods[Math.floor(Math.random() * methods.length)]
  };
};

export const mockOrders: Order[] = Array.from({ length: 15 }, (_, i) => generateRandomOrder(i));

export const mockPayments: Payment[] = Array.from({ length: 12 }, (_, i) => generateRandomPayment(i));

export const mockSalesData: SalesData[] = [
  { month: 'Jan', currentYear: 12000, lastYear: 9000 },
  { month: 'Feb', currentYear: 15000, lastYear: 11000 },
  { month: 'Mar', currentYear: 18000, lastYear: 14000 },
  { month: 'Apr', currentYear: 22000, lastYear: 16000 },
  { month: 'May', currentYear: 25000, lastYear: 19000 },
  { month: 'Jun', currentYear: 28000, lastYear: 21000 },
  { month: 'Jul', currentYear: 32000, lastYear: 24000 },
  { month: 'Aug', currentYear: 35000, lastYear: 27000 },
  { month: 'Sep', currentYear: 38000, lastYear: 29000 },
  { month: 'Oct', currentYear: 41000, lastYear: 32000 },
  { month: 'Nov', currentYear: 44000, lastYear: 35000 },
  { month: 'Dec', currentYear: 47000, lastYear: 38000 }
];

export const mockTopCustomers: CustomerSales[] = [
  { id: '1', name: 'Acme Corp', sales: 45000, orders: 120 },
  { id: '2', name: 'Global Tech', sales: 38000, orders: 95 },
  { id: '3', name: 'Metro Supplies', sales: 32000, orders: 88 },
  { id: '4', name: 'City Retail', sales: 28000, orders: 76 },
  { id: '5', name: 'Prime Distribution', sales: 25000, orders: 65 },
  { id: '6', name: 'Elite Partners', sales: 22000, orders: 58 },
  { id: '7', name: 'Smart Solutions', sales: 19000, orders: 52 },
  { id: '8', name: 'Future Systems', sales: 16000, orders: 45 },
  { id: '9', name: 'Dynamic Group', sales: 14000, orders: 39 },
  { id: '10', name: 'Nexus Trading', sales: 12000, orders: 33 }
];

export const mockStats: DashboardStats = {
  totalOrders: 1245,
  totalPayments: 987,
  totalRevenue: 523000,
  activeCustomers: 156
};