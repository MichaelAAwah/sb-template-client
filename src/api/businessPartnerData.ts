import { 
  BusinessPartner, 
  BPTransaction, 
  BPSalesData, 
  BPAgedAnalysis, 
  BPStats,
  BPGroup,
  PriceList,
  BPNote,
  SalesRep
} from '../types/businessPartner';

// Mock BP Groups
export const mockBPGroups: BPGroup[] = [
  { id: 'grp-001', code: 'RETAIL', name: 'Retail Customers', description: 'Individual retail customers' },
  { id: 'grp-002', code: 'WHOLESALE', name: 'Wholesale Customers', description: 'Bulk wholesale customers' },
  { id: 'grp-003', code: 'CORPORATE', name: 'Corporate Clients', description: 'Large corporate accounts' },
  { id: 'grp-004', code: 'SUPPLIER', name: 'Suppliers', description: 'Product and service suppliers' },
  { id: 'grp-005', code: 'CONTRACTOR', name: 'Contractors', description: 'Service contractors' },
];

// Mock Price Lists
export const mockPriceLists: PriceList[] = [
  { id: 'pl-001', code: 'STANDARD', name: 'Standard Price List', currency: 'GHS' },
  { id: 'pl-002', code: 'WHOLESALE', name: 'Wholesale Price List', currency: 'GHS' },
  { id: 'pl-003', code: 'VIP', name: 'VIP Customer Pricing', currency: 'GHS' },
  { id: 'pl-004', code: 'USD-STD', name: 'USD Standard Pricing', currency: 'USD' },
];

// Mock Sales Reps
export const mockSalesReps: SalesRep[] = [
  { id: 'rep-001', firstName: 'John', lastName: 'Mensah', email: 'john.mensah@company.com', mobile: '+233-20-111-2222' },
  { id: 'rep-002', firstName: 'Sarah', lastName: 'Asante', email: 'sarah.asante@company.com', mobile: '+233-24-333-4444' },
  { id: 'rep-003', firstName: 'Michael', lastName: 'Osei', email: 'michael.osei@company.com', mobile: '+233-26-555-6666' },
  { id: 'rep-004', firstName: 'Grace', lastName: 'Adjei', email: 'grace.adjei@company.com', mobile: '+233-27-777-8888' },
];

// Generate mock business partners
const generateMockBusinessPartner = (index: number): BusinessPartner => {
  const bpTypes: ('Customer' | 'Vendor' | 'Lead' | 'Employee')[] = ['Customer', 'Vendor', 'Lead', 'Employee'];
  const groups = mockBPGroups;
  const currencies: ('EUR' | 'USD' | 'GBP' | 'GHS' | 'CFA' | 'NGN')[] = ['GHS', 'USD', 'EUR', 'GBP', 'NGN'];
  const industries = ['Retail', 'Manufacturing', 'Technology', 'Healthcare', 'Education', 'Finance'];
  
  const bpType = bpTypes[Math.floor(Math.random() * bpTypes.length)];
  const group = groups[Math.floor(Math.random() * groups.length)];
  const currency = currencies[Math.floor(Math.random() * currencies.length)];
  const industry = industries[Math.floor(Math.random() * industries.length)];
  const salesRep = mockSalesReps[Math.floor(Math.random() * mockSalesReps.length)];
  
  const names = [
    'Akosua Trading Co.', 'Nana Provisions Ltd.', 'Yaa Supermarket', 'Kofi Wholesale',
    'Ama General Store', 'Kwame Industries', 'Adwoa Enterprises', 'Kojo Supplies',
    'Efua Commerce', 'Kwaku Distribution', 'Abena Retail', 'Fiifi Trading'
  ];
  
  const name = names[index % names.length];
  const code = `BP${String(1000 + index).padStart(6, '0')}`;
  
  const balance = (Math.random() - 0.5) * 50000; // Can be positive or negative
  const creditLimit = Math.floor(Math.random() * 100000) + 10000;
  
  return {
    id: `bp-${1000 + index}`,
    masterData: {
      bpType,
      name,
      displayName: name,
      bpGroup: group.name,
      currency,
      tinNo: `TIN${String(Math.floor(Math.random() * 1000000)).padStart(8, '0')}`,
    },
    general: {
      telephone1: `+233-${20 + Math.floor(Math.random() * 8)}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      telephone2: Math.random() > 0.7 ? `+233-${20 + Math.floor(Math.random() * 8)}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}` : '',
      mobilePhone: `+233-${20 + Math.floor(Math.random() * 8)}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@email.com`,
      industry,
      fax: Math.random() > 0.8 ? `+233-30-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}` : '',
      website: Math.random() > 0.6 ? `www.${name.toLowerCase().replace(/[^a-z]/g, '')}.com` : '',
    },
    contactPersons: [
      {
        id: `contact-${index}-1`,
        firstName: ['Akosua', 'Nana', 'Yaa', 'Kofi', 'Ama', 'Kwame'][Math.floor(Math.random() * 6)],
        lastName: ['Mensah', 'Asante', 'Osei', 'Adjei', 'Boateng', 'Owusu'][Math.floor(Math.random() * 6)],
        middleName: Math.random() > 0.7 ? 'Kwame' : '',
        title: ['Mr.', 'Mrs.', 'Ms.', 'Dr.'][Math.floor(Math.random() * 4)],
        position: ['Manager', 'Director', 'Owner', 'Supervisor'][Math.floor(Math.random() * 4)],
        address: `${Math.floor(Math.random() * 999) + 1} ${['Market', 'Commercial', 'Trade', 'Business'][Math.floor(Math.random() * 4)]} Street`,
        gpsAddress: `GA-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        telephone1: `+233-${20 + Math.floor(Math.random() * 8)}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        telephone2: '',
        mobilePhone: `+233-${20 + Math.floor(Math.random() * 8)}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        email: `contact@${name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
        fax: '',
        remarks: Math.random() > 0.8 ? 'Primary contact for all business matters' : '',
      }
    ],
    addresses: [
      {
        id: `addr-${index}-1`,
        addressType: 'Bill To',
        addressName2: name,
        addressName3: '',
        poBox: Math.random() > 0.6 ? `P.O. Box ${Math.floor(Math.random() * 9000) + 1000}` : '',
        streetNo: `${Math.floor(Math.random() * 999) + 1}`,
        block: Math.random() > 0.7 ? `Block ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}` : '',
        city: ['Accra', 'Kumasi', 'Tamale', 'Cape Coast', 'Ho'][Math.floor(Math.random() * 5)],
        state: ['Greater Accra', 'Ashanti', 'Northern', 'Central', 'Volta'][Math.floor(Math.random() * 5)],
        zipCode: Math.random() > 0.5 ? `${Math.floor(Math.random() * 90000) + 10000}` : '',
        country: 'Ghana',
        gpsAddress: `GA-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      }
    ],
    accounting: {
      controlAccountId: `ACC-${Math.floor(Math.random() * 9000) + 1000}`,
      controlAccounts: 'Trade Receivables',
      openingBalance: Math.floor(Math.random() * 10000),
      openingBalanceDate: new Date(2024, 0, 1).toISOString().split('T')[0],
    },
    paymentAndBilling: {
      paymentTerms: ['Net 30', 'Net 15', 'Due on Receipt', 'Net 60'][Math.floor(Math.random() * 4)],
      paymentMethods: ['Cash', 'Bank Transfer', 'Mobile Money', 'Cheque'][Math.floor(Math.random() * 4)],
      bankName: ['GCB Bank', 'Ecobank', 'Standard Chartered', 'Fidelity Bank'][Math.floor(Math.random() * 4)],
      branchName: ['Main Branch', 'Commercial Branch', 'Industrial Area'][Math.floor(Math.random() * 3)],
    },
    creditControl: {
      creditLimit,
      autoMomoDebit: Math.random() > 0.7,
    },
    defaultSettings: {
      statementDistribution: ['None', 'Print', 'Email', 'Email & Print'][Math.floor(Math.random() * 4)] as any,
      frequency: ['Every 15 days', 'End of Month', 'End of Quarter', 'End of Year'][Math.floor(Math.random() * 4)] as any,
      defaultDiscount: Math.floor(Math.random() * 15),
      defaultPriceList: mockPriceLists[Math.floor(Math.random() * mockPriceLists.length)].name,
    },
    salesRep,
    status: Math.random() > 0.1 ? 'Active' : 'Inactive',
    balance,
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const mockBusinessPartners: BusinessPartner[] = Array.from({ length: 30 }, (_, i) => generateMockBusinessPartner(i));

// Generate mock transactions for a BP
const generateMockTransactions = (bpId: string, count: number = 20): BPTransaction[] => {
  const transactions: BPTransaction[] = [];
  let runningBalance = Math.floor(Math.random() * 10000);
  
  for (let i = 0; i < count; i++) {
    const types: ('Invoice' | 'Payment' | 'Credit Note' | 'Debit Note')[] = ['Invoice', 'Payment', 'Credit Note', 'Debit Note'];
    const type = types[Math.floor(Math.random() * types.length)];
    const amount = Math.floor(Math.random() * 5000) + 100;
    
    const debit = ['Invoice', 'Debit Note'].includes(type) ? amount : 0;
    const credit = ['Payment', 'Credit Note'].includes(type) ? amount : 0;
    
    runningBalance += debit - credit;
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    
    transactions.push({
      id: `txn-${bpId}-${i}`,
      date: date.toISOString().split('T')[0],
      type,
      documentNo: `${type.charAt(0)}${String(1000 + i).padStart(6, '0')}`,
      description: `${type} for business partner`,
      debit,
      credit,
      balance: runningBalance,
      status: Math.random() > 0.8 ? 'Overdue' : Math.random() > 0.3 ? 'Paid' : 'Open',
    });
  }
  
  return transactions.reverse(); // Most recent first
};

// Generate mock sales data for a BP
const generateMockSalesData = (): BPSalesData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    sales: Math.floor(Math.random() * 15000) + 2000,
    invoices: Math.floor(Math.random() * 20) + 1,
  }));
};

// Generate mock aged analysis
const generateMockAgedAnalysis = (): BPAgedAnalysis => ({
  current: Math.floor(Math.random() * 10000),
  days30: Math.floor(Math.random() * 8000),
  days60: Math.floor(Math.random() * 5000),
  days90: Math.floor(Math.random() * 3000),
  over90: Math.floor(Math.random() * 2000),
});

export const mockBPStats: BPStats = {
  totalCustomers: mockBusinessPartners.filter(bp => bp.masterData.bpType === 'Customer').length,
  totalVendors: mockBusinessPartners.filter(bp => bp.masterData.bpType === 'Vendor').length,
  activePartners: mockBusinessPartners.filter(bp => bp.status === 'Active').length,
  totalBalance: mockBusinessPartners.reduce((sum, bp) => sum + bp.balance, 0),
};

// Mock API functions
export const fetchBusinessPartners = async (filters?: any): Promise<BusinessPartner[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let filteredPartners = [...mockBusinessPartners];
  
  if (filters) {
    if (filters.bpType && filters.bpType.length > 0) {
      filteredPartners = filteredPartners.filter(bp => filters.bpType.includes(bp.masterData.bpType));
    }
    
    if (filters.status && filters.status.length > 0) {
      filteredPartners = filteredPartners.filter(bp => filters.status.includes(bp.status));
    }
    
    if (filters.group) {
      filteredPartners = filteredPartners.filter(bp => 
        bp.masterData.bpGroup.toLowerCase().includes(filters.group.toLowerCase())
      );
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredPartners = filteredPartners.filter(bp => 
        bp.masterData.name.toLowerCase().includes(searchLower) ||
        bp.masterData.displayName.toLowerCase().includes(searchLower) ||
        bp.general.email.toLowerCase().includes(searchLower)
      );
    }
  }
  
  return filteredPartners.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

export const fetchBusinessPartnerById = async (id: string): Promise<BusinessPartner | null> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockBusinessPartners.find(bp => bp.id === id) || null;
};

export const fetchBPTransactions = async (bpId: string): Promise<BPTransaction[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return generateMockTransactions(bpId);
};

export const fetchBPSalesData = async (bpId: string): Promise<BPSalesData[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateMockSalesData();
};

export const fetchBPAgedAnalysis = async (bpId: string): Promise<BPAgedAnalysis> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return generateMockAgedAnalysis();
};

export const createBusinessPartner = async (bp: Omit<BusinessPartner, 'id' | 'createdAt' | 'updatedAt'>): Promise<BusinessPartner> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newBP: BusinessPartner = {
    ...bp,
    id: `bp-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockBusinessPartners.unshift(newBP);
  return newBP;
};

export const updateBusinessPartner = async (id: string, updates: Partial<BusinessPartner>): Promise<BusinessPartner> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = mockBusinessPartners.findIndex(bp => bp.id === id);
  if (index === -1) {
    throw new Error('Business partner not found');
  }
  
  const updatedBP = {
    ...mockBusinessPartners[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  mockBusinessPartners[index] = updatedBP;
  return updatedBP;
};

export const createSalesRep = async (rep: Omit<SalesRep, 'id'>): Promise<SalesRep> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newRep: SalesRep = {
    ...rep,
    id: `rep-${Date.now()}`,
  };
  
  mockSalesReps.push(newRep);
  return newRep;
};

// Helper functions
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const formatBalance = (balance: number, currency: string): string => {
  const symbols = {
    'GHS': '₵',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'NGN': '₦',
    'CFA': 'CFA',
  };
  
  const symbol = symbols[currency as keyof typeof symbols] || currency;
  const absBalance = Math.abs(balance);
  const sign = balance < 0 ? '-' : '';
  
  return `${sign}${symbol}${absBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
};

export const getBPTypeColor = (type: string) => {
  const colors = {
    'Customer': 'bg-blue-100 text-blue-800',
    'Vendor': 'bg-green-100 text-green-800',
    'Lead': 'bg-yellow-100 text-yellow-800',
    'Employee': 'bg-purple-100 text-purple-800',
  };
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export const getStatusColor = (status: string) => {
  return status === 'Active' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
};