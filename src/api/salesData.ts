import { SalesQuotation, SalesQuotationItem, Customer, Item, SalesEmployee, TaxGroup } from '../types/sales';

// Tax Groups data
export const taxGroups: TaxGroup[] = [
  { code: 'V0', name: 'VAT-0%', category: 'Output Tax', rate: '0%', rateValue: 0, effectiveTerm: '01.01.2000', taxAccount: '0041', inactiveName: 'N' },
  { code: 'V1', name: 'VAT- Standard Rate 12.5%', category: 'Output Tax', rate: '12.5%', rateValue: 12.5, effectiveTerm: '01.01.2000', taxAccount: '0041', inactiveName: 'N' },
  { code: 'V2', name: 'NHIL 2.5%', category: 'Output Tax', rate: '2.5%', rateValue: 2.5, effectiveTerm: '01.01.2000', taxAccount: '0', inactiveName: 'N' },
  { code: 'V3', name: 'GetFund 2.5%', category: 'Output Tax', rate: '2.5%', rateValue: 2.5, effectiveTerm: '01.01.2000', taxAccount: '0', inactiveName: 'N' },
  { code: 'V4', name: 'COVID-19 HRL 1%', category: 'Output Tax', rate: '1%', rateValue: 1, effectiveTerm: '01.01.2000', taxAccount: '0', inactiveName: 'N' },
  { code: 'V5', name: 'VAT- Flat Rate 3%', category: 'Output Tax', rate: '3%', rateValue: 3, effectiveTerm: '01.01.2000', taxAccount: '0041', inactiveName: 'N' },
  { code: 'V6', name: 'Withholding VAT 7%', category: 'Input Tax', rate: '7%', rateValue: 7, effectiveTerm: '01.01.2000', taxAccount: '0041', inactiveName: 'N' },
  { code: 'W1', name: 'WHT 7.5%', category: 'Input Tax', rate: '8%', rateValue: 8, effectiveTerm: '01.01.2000', taxAccount: '0042', inactiveName: 'N' },
  { code: 'W2', name: 'WHT 5%', category: 'Input Tax', rate: '5%', rateValue: 5, effectiveTerm: '01.01.2000', taxAccount: '0042', inactiveName: 'N' },
  { code: 'W3', name: 'WHT 3%', category: 'Input Tax', rate: '3%', rateValue: 3, effectiveTerm: '01.01.2000', taxAccount: '0042', inactiveName: 'N' },
  { code: 'RT1', name: 'Rent tax 8%', category: 'Input Tax', rate: '8%', rateValue: 8, effectiveTerm: '01.01.2000', taxAccount: '0', inactiveName: 'N' },
  { code: 'RT2', name: 'Rent tax 15%', category: 'Output Tax', rate: '15%', rateValue: 15, effectiveTerm: '01.01.2000', taxAccount: '0', inactiveName: 'N' },
  { code: 'C1', name: 'CST 5%', category: 'Input Tax', rate: '5%', rateValue: 5, effectiveTerm: '01.01.2000', taxAccount: '0', inactiveName: 'N' },
];

// Mock customers
export const mockCustomers: Customer[] = [
  {
    id: 'cust-001',
    code: 'CUST001',
    name: 'Akosua Trading Co.',
    contactPerson: 'Akosua Mensah',
    email: 'akosua@trading.com',
    phone: '+233-20-111-2222',
    address: '12 Market Street, Kumasi',
    shipToAddress: '12 Market Street, Kumasi',
    billToAddress: '12 Market Street, Kumasi',
    currency: 'GHS'
  },
  {
    id: 'cust-002',
    code: 'CUST002',
    name: 'Nana Provisions',
    contactPerson: 'Nana Asante',
    email: 'nana@provisions.gh',
    phone: '+233-24-333-4444',
    address: '45 Commercial Ave, Accra',
    shipToAddress: '45 Commercial Ave, Accra',
    billToAddress: '45 Commercial Ave, Accra',
    currency: 'USD'
  },
  {
    id: 'cust-003',
    code: 'CUST003',
    name: 'Yaa Supermarket',
    contactPerson: 'Yaa Osei',
    email: 'yaa@supermarket.gh',
    phone: '+233-26-555-6666',
    address: '78 Main Road, Cape Coast',
    shipToAddress: '78 Main Road, Cape Coast',
    billToAddress: '78 Main Road, Cape Coast',
    currency: 'EUR'
  },
  {
    id: 'cust-004',
    code: 'CUST004',
    name: 'Kofi Wholesale',
    contactPerson: 'Kofi Adjei',
    email: 'kofi@wholesale.com',
    phone: '+233-27-777-8888',
    address: '90 Trade Center, Tamale',
    shipToAddress: '90 Trade Center, Tamale',
    billToAddress: '90 Trade Center, Tamale',
    currency: 'GBP'
  },
  {
    id: 'cust-005',
    code: 'CUST005',
    name: 'Ama General Store',
    contactPerson: 'Ama Boateng',
    email: 'ama@generalstore.gh',
    phone: '+233-20-999-0000',
    address: '23 Shopping Complex, Ho',
    shipToAddress: '23 Shopping Complex, Ho',
    billToAddress: '23 Shopping Complex, Ho',
    currency: 'NGN'
  }
];

// Currency data and exchange rates (to GHS)
export const currencies: Currency[] = [
  { code: 'GHS', name: 'Ghana Cedi', symbol: '₵', exchangeRate: 1.0 },
  { code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 0.083 },
  { code: 'EUR', name: 'Euro', symbol: '€', exchangeRate: 0.076 },
  { code: 'GBP', name: 'British Pound', symbol: '£', exchangeRate: 0.065 },
  { code: 'CFA', name: 'CFA Franc', symbol: 'CFA', exchangeRate: 50.0 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', exchangeRate: 125.0 },
];

export const exchangeRates: ExchangeRates = {
  'GHS': 1.0,
  'USD': 0.083,
  'EUR': 0.076,
  'GBP': 0.065,
  'CFA': 50.0,
  'NGN': 125.0,
};

export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = currencies.find(c => c.code === currencyCode);
  return currency?.symbol || currencyCode;
};

export const convertPrice = (priceInGHS: number, targetCurrency: string): number => {
  const rate = exchangeRates[targetCurrency] || 1.0;
  return priceInGHS * rate;
};

export const convertFromGHS = (amount: number, fromCurrency: string, toCurrency: string): number => {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to GHS first if not already
  const amountInGHS = fromCurrency === 'GHS' ? amount : amount / exchangeRates[fromCurrency];
  
  // Convert from GHS to target currency
  return amountInGHS * exchangeRates[toCurrency];
};

// Mock items
export const mockItems: Item[] = [
  {
    id: 'item-001',
    no: 'RICE001',
    name: 'Premium Rice',
    description: 'Premium quality rice (50kg bag)',
    type: 'Item',
    unitPrice: 180,
    uomName: 'BAG',
    location: 'MAIN-WH'
  },
  {
    id: 'item-002',
    no: 'OIL001',
    name: 'Cooking Oil',
    description: 'Pure vegetable cooking oil (5L)',
    type: 'Item',
    unitPrice: 45,
    uomName: 'BOTTLE',
    location: 'MAIN-WH'
  },
  {
    id: 'item-003',
    no: 'SUGAR001',
    name: 'White Sugar',
    description: 'Refined white sugar (1kg)',
    type: 'Item',
    unitPrice: 8,
    uomName: 'KG',
    location: 'MAIN-WH'
  },
  {
    id: 'item-004',
    no: 'FLOUR001',
    name: 'Wheat Flour',
    description: 'All-purpose wheat flour (25kg)',
    type: 'Item',
    unitPrice: 120,
    uomName: 'BAG',
    location: 'MAIN-WH'
  },
  {
    id: 'item-005',
    no: 'PASTE001',
    name: 'Tomato Paste',
    description: 'Concentrated tomato paste (400g)',
    type: 'Item',
    unitPrice: 3.5,
    uomName: 'CAN',
    location: 'MAIN-WH'
  },
  {
    id: 'item-006',
    no: 'MILK001',
    name: 'Milk Powder',
    description: 'Full cream milk powder (900g)',
    type: 'Item',
    unitPrice: 25,
    uomName: 'TIN',
    location: 'MAIN-WH'
  },
  {
    id: 'serv-001',
    no: 'DELIV001',
    name: 'Delivery Service',
    description: 'Standard delivery service',
    type: 'Service',
    unitPrice: 50,
    uomName: 'SERVICE',
    location: ''
  },
  {
    id: 'serv-002',
    no: 'INSTALL001',
    name: 'Installation Service',
    description: 'Professional installation service',
    type: 'Service',
    unitPrice: 100,
    uomName: 'SERVICE',
    location: ''
  }
];

// Mock sales employees
export const mockSalesEmployees: SalesEmployee[] = [
  { id: 'emp-001', code: 'SE001', name: 'John Mensah', email: 'john.mensah@company.com' },
  { id: 'emp-002', code: 'SE002', name: 'Sarah Asante', email: 'sarah.asante@company.com' },
  { id: 'emp-003', code: 'SE003', name: 'Michael Osei', email: 'michael.osei@company.com' },
  { id: 'emp-004', code: 'SE004', name: 'Grace Adjei', email: 'grace.adjei@company.com' },
];

// Generate mock sales quotations
const generateMockQuotation = (index: number): SalesQuotation => {
  const customer = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
  const salesEmployee = mockSalesEmployees[Math.floor(Math.random() * mockSalesEmployees.length)];
  const statuses: ('Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired')[] = ['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  
  const validUntil = new Date(date);
  validUntil.setDate(validUntil.getDate() + 30);
  
  // Generate 1-5 random items
  const numItems = Math.floor(Math.random() * 5) + 1;
  const quotationItems: SalesQuotationItem[] = [];
  
  for (let i = 0; i < numItems; i++) {
    const item = mockItems[Math.floor(Math.random() * mockItems.length)];
    const quantity = Math.floor(Math.random() * 20) + 1;
    const taxCode = taxGroups[Math.floor(Math.random() * taxGroups.length)];
    
    quotationItems.push({
      id: `item-${index}-${i}`,
      type: item.type,
      itemNo: item.no,
      itemName: item.name,
      itemDescription: item.description,
      quantity,
      unitPrice: item.unitPrice,
      total: quantity * item.unitPrice,
      taxCode: taxCode.code,
      taxOnly: Math.random() > 0.9, // 10% chance of tax-only items
      uomName: item.uomName,
      deliveryDate: new Date(date.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      location: item.location,
      project: Math.random() > 0.7 ? `PROJECT-${Math.floor(Math.random() * 100) + 1}` : ''
    });
  }
  
  // Calculate totals
  const subtotal = quotationItems.filter(item => !item.taxOnly).reduce((sum, item) => sum + item.total, 0);
  const discountType: 'percentage' | 'amount' = Math.random() > 0.5 ? 'percentage' : 'amount';
  const discountValue = discountType === 'percentage' ? Math.floor(Math.random() * 15) : Math.floor(Math.random() * 100);
  const discountAmount = discountType === 'percentage' ? (subtotal * discountValue / 100) : discountValue;
  
  // Calculate tax
  let taxAmount = 0;
  quotationItems.forEach(item => {
    const taxGroup = taxGroups.find(tg => tg.code === item.taxCode);
    if (taxGroup) {
      const taxableAmount = item.taxOnly ? item.total : item.total;
      taxAmount += (taxableAmount * taxGroup.rateValue / 100);
    }
  });
  
  const total = (subtotal - discountAmount) + taxAmount;
  
  return {
    id: `quot-${1000 + index}`,
    documentNo: `SQ-${String(1000 + index).padStart(6, '0')}`,
    customerName: customer.name,
    customerCode: customer.code,
    contactPerson: customer.contactPerson,
    postingDate: date.toISOString().split('T')[0],
    documentDate: date.toISOString().split('T')[0],
    validUntil: validUntil.toISOString().split('T')[0],
    shipTo: customer.shipToAddress,
    billTo: customer.billToAddress,
    status,
    items: quotationItems,
    salesEmployee: salesEmployee.name,
    remarks: Math.random() > 0.7 ? 'Special pricing applied for bulk order' : '',
    subtotal,
    discountType,
    discountValue,
    discountAmount,
    taxAmount,
    total,
    currency: 'GHS',
    exchangeRate: 1.0,
    createdAt: date.toISOString(),
    updatedAt: date.toISOString()
  };
};

export const mockSalesQuotations: SalesQuotation[] = Array.from({ length: 25 }, (_, i) => generateMockQuotation(i));

// Generate mock sales orders
const generateMockOrder = (index: number): SalesOrder => {
  const customer = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
  const salesEmployee = mockSalesEmployees[Math.floor(Math.random() * mockSalesEmployees.length)];
  const statuses: ('Open' | 'Released' | 'Pending Approval' | 'Pending Prepayment' | 'Completely Shipped')[] = 
    ['Open', 'Released', 'Pending Approval', 'Pending Prepayment', 'Completely Shipped'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  
  const requestedDeliveryDate = new Date(date);
  requestedDeliveryDate.setDate(requestedDeliveryDate.getDate() + Math.floor(Math.random() * 14) + 1);
  
  // Generate 1-5 random items
  const numItems = Math.floor(Math.random() * 5) + 1;
  const orderItems: SalesOrderItem[] = [];
  
  for (let i = 0; i < numItems; i++) {
    const item = mockItems[Math.floor(Math.random() * mockItems.length)];
    const quantity = Math.floor(Math.random() * 20) + 1;
    const taxCode = taxGroups[Math.floor(Math.random() * taxGroups.length)];
    
    orderItems.push({
      id: `item-${index}-${i}`,
      type: item.type,
      itemNo: item.no,
      itemName: item.name,
      itemDescription: item.description,
      quantity,
      unitPrice: item.unitPrice,
      total: quantity * item.unitPrice,
      taxCode: taxCode.code,
      taxOnly: Math.random() > 0.9,
      uomName: item.uomName,
      deliveryDate: new Date(date.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      location: item.location,
      project: Math.random() > 0.7 ? `PROJECT-${Math.floor(Math.random() * 100) + 1}` : ''
    });
  }
  
  // Calculate totals
  const subtotal = orderItems.filter(item => !item.taxOnly).reduce((sum, item) => sum + item.total, 0);
  const discountType: 'percentage' | 'amount' = Math.random() > 0.5 ? 'percentage' : 'amount';
  const discountValue = discountType === 'percentage' ? Math.floor(Math.random() * 15) : Math.floor(Math.random() * 100);
  const discountAmount = discountType === 'percentage' ? (subtotal * discountValue / 100) : discountValue;
  
  // Calculate tax
  let taxAmount = 0;
  orderItems.forEach(item => {
    const taxGroup = taxGroups.find(tg => tg.code === item.taxCode);
    if (taxGroup) {
      const taxableAmount = item.taxOnly ? item.total : item.total;
      taxAmount += (taxableAmount * taxGroup.rateValue / 100);
    }
  });
  
  const total = (subtotal - discountAmount) + taxAmount;
  
  return {
    id: `order-${1000 + index}`,
    documentNo: `SO-${String(1000 + index).padStart(6, '0')}`,
    customerName: customer.name,
    customerCode: customer.code,
    contactPerson: customer.contactPerson,
    postingDate: date.toISOString().split('T')[0],
    documentDate: date.toISOString().split('T')[0],
    requestedDeliveryDate: requestedDeliveryDate.toISOString().split('T')[0],
    shipTo: customer.shipToAddress,
    billTo: customer.billToAddress,
    status,
    items: orderItems,
    salesEmployee: salesEmployee.name,
    remarks: Math.random() > 0.7 ? 'Urgent delivery required' : '',
    subtotal,
    discountType,
    discountValue,
    discountAmount,
    taxAmount,
    total,
    currency: 'GHS',
    exchangeRate: 1.0,
    createdAt: date.toISOString(),
    updatedAt: date.toISOString()
  };
};

export const mockSalesOrders: SalesOrder[] = Array.from({ length: 20 }, (_, i) => generateMockOrder(i));