import { Order, OrderItem, CustomerInfo, WarehouseInfo, PaymentInfo, OrderStats } from '../types/orders';

// Mock warehouses
export const mockWarehouses: WarehouseInfo[] = [
  {
    id: 'wh-001',
    name: 'Central Warehouse',
    code: 'CW-001',
    address: '123 Industrial Area, Accra',
    manager: 'John Mensah',
    phone: '+233-20-123-4567'
  },
  {
    id: 'wh-002',
    name: 'Northern Distribution Center',
    code: 'NDC-002',
    address: '456 Trade Zone, Tamale',
    manager: 'Fatima Abdul',
    phone: '+233-24-987-6543'
  },
  {
    id: 'wh-003',
    name: 'Western Hub',
    code: 'WH-003',
    address: '789 Port Road, Takoradi',
    manager: 'Kwame Asante',
    phone: '+233-26-555-0123'
  }
];

// Mock customers
const mockCustomers: CustomerInfo[] = [
  {
    id: 'cust-001',
    name: 'Akosua Trading Co.',
    phone: '+233-20-111-2222',
    email: 'akosua@trading.com',
    address: '12 Market Street, Kumasi',
    location: { region: 'Ashanti', district: 'Kumasi Metro' }
  },
  {
    id: 'cust-002',
    name: 'Nana Provisions',
    phone: '+233-24-333-4444',
    address: '45 Commercial Ave, Accra',
    location: { region: 'Greater Accra', district: 'Accra Metro' }
  },
  {
    id: 'cust-003',
    name: 'Yaa Supermarket',
    phone: '+233-26-555-6666',
    email: 'yaa@supermarket.gh',
    address: '78 Main Road, Cape Coast',
    location: { region: 'Central', district: 'Cape Coast Metro' }
  },
  {
    id: 'cust-004',
    name: 'Kofi Wholesale',
    phone: '+233-27-777-8888',
    address: '90 Trade Center, Tamale',
    location: { region: 'Northern', district: 'Tamale Metro' }
  },
  {
    id: 'cust-005',
    name: 'Ama General Store',
    phone: '+233-20-999-0000',
    address: '23 Shopping Complex, Ho',
    location: { region: 'Volta', district: 'Ho Municipal' }
  }
];

// Mock order items
const mockOrderItems: OrderItem[] = [
  { id: 'item-001', name: 'Rice (50kg bag)', sku: 'RICE-50KG', quantity: 10, unitPrice: 180, totalPrice: 1800 },
  { id: 'item-002', name: 'Cooking Oil (5L)', sku: 'OIL-5L', quantity: 24, unitPrice: 45, totalPrice: 1080 },
  { id: 'item-003', name: 'Sugar (1kg)', sku: 'SUGAR-1KG', quantity: 50, unitPrice: 8, totalPrice: 400 },
  { id: 'item-004', name: 'Flour (25kg)', sku: 'FLOUR-25KG', quantity: 8, unitPrice: 120, totalPrice: 960 },
  { id: 'item-005', name: 'Tomato Paste (400g)', sku: 'PASTE-400G', quantity: 100, unitPrice: 3.5, totalPrice: 350 },
  { id: 'item-006', name: 'Milk Powder (900g)', sku: 'MILK-900G', quantity: 20, unitPrice: 25, totalPrice: 500 },
  { id: 'item-007', name: 'Soap (200g)', sku: 'SOAP-200G', quantity: 60, unitPrice: 2.5, totalPrice: 150 },
  { id: 'item-008', name: 'Detergent (1kg)', sku: 'DET-1KG', quantity: 30, unitPrice: 12, totalPrice: 360 }
];

// Generate random order
const generateRandomOrder = (index: number): Order => {
  const customer = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
  const statuses = ['Confirmed', 'Approved', 'Preparing', 'Ready for Pickup', 'Dispatched', 'Fulfilled'];
  const channels = ['USSD', 'Mobile Web', 'Field Agent'];
  const paymentMethods = ['Cash', 'Mobile Money', 'Bank Transfer', 'Credit'];
  
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  
  const time = new Date();
  time.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  
  // Generate 1-4 random items for the order
  const numItems = Math.floor(Math.random() * 4) + 1;
  const orderItems: OrderItem[] = [];
  const usedItems = new Set<number>();
  
  for (let i = 0; i < numItems; i++) {
    let itemIndex;
    do {
      itemIndex = Math.floor(Math.random() * mockOrderItems.length);
    } while (usedItems.has(itemIndex));
    
    usedItems.add(itemIndex);
    const baseItem = mockOrderItems[itemIndex];
    const quantity = Math.floor(Math.random() * 20) + 1;
    
    orderItems.push({
      ...baseItem,
      id: `${baseItem.id}-${index}-${i}`,
      quantity,
      totalPrice: baseItem.unitPrice * quantity
    });
  }
  
  const totalAmount = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const status = statuses[Math.floor(Math.random() * statuses.length)] as any;
  const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)] as any;
  
  const payment: PaymentInfo = {
    method: paymentMethod,
    amount: totalAmount,
    status: status === 'Confirmed' ? 'Pending' : 'Completed',
    transactionId: status !== 'Confirmed' ? `TXN-${Date.now()}-${index}` : undefined,
    paidAt: status !== 'Confirmed' ? date.toISOString() : undefined
  };
  
  const order: Order = {
    id: `ord-${1000 + index}`,
    orderNo: `ORD-${String(1000 + index).padStart(6, '0')}`,
    date: date.toISOString().split('T')[0],
    time: time.toTimeString().split(' ')[0].slice(0, 5),
    customer,
    items: orderItems,
    totalAmount,
    status,
    channel: channels[Math.floor(Math.random() * channels.length)] as any,
    payment,
    notes: Math.random() > 0.7 ? 'Customer requested expedited delivery' : undefined
  };
  
  // Add warehouse and timestamps for orders beyond 'Confirmed'
  if (['Approved', 'Preparing', 'Ready for Pickup', 'Dispatched', 'Fulfilled'].includes(status)) {
    order.warehouse = mockWarehouses[Math.floor(Math.random() * mockWarehouses.length)];
    order.assignedAt = new Date(date.getTime() + 3600000).toISOString(); // 1 hour later
    order.assignedBy = 'System Admin';
    
    if (status !== 'Approved') {
      const eta = new Date(date);
      eta.setDate(eta.getDate() + Math.floor(Math.random() * 7) + 1);
      order.eta = eta.toISOString().split('T')[0];
    }
    
    if (['Preparing', 'Ready for Pickup', 'Dispatched', 'Fulfilled'].includes(status)) {
      order.issuedAt = new Date(date.getTime() + 7200000).toISOString(); // 2 hours later
    }
    
    if (['Ready for Pickup', 'Dispatched', 'Fulfilled'].includes(status)) {
      order.dispatchedAt = new Date(date.getTime() + 10800000).toISOString(); // 3 hours later
    }
    
    if (status === 'Fulfilled') {
      order.fulfilledAt = new Date(date.getTime() + 14400000).toISOString(); // 4 hours later
    }
  }
  
  return order;
};

export const mockOrders: Order[] = Array.from({ length: 50 }, (_, i) => generateRandomOrder(i));

export const mockOrderStats: OrderStats = {
  total: mockOrders.length,
  confirmed: mockOrders.filter(o => o.status === 'Confirmed').length,
  approved: mockOrders.filter(o => o.status === 'Approved').length,
  preparing: mockOrders.filter(o => o.status === 'Preparing').length,
  readyForPickup: mockOrders.filter(o => o.status === 'Ready for Pickup').length,
  dispatched: mockOrders.filter(o => o.status === 'Dispatched').length,
  fulfilled: mockOrders.filter(o => o.status === 'Fulfilled').length,
  cancelled: mockOrders.filter(o => o.status === 'Cancelled').length,
};