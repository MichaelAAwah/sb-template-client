import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  SalesQuotation, 
  SalesQuotationFilters, 
  SalesOrder,
  SalesOrderFilters,
  Customer, 
  Item, 
  SalesEmployee,
  CopyDocumentData,
  DocumentType
} from '../types/sales';
import { mockSalesQuotations, mockSalesOrders, mockCustomers, mockItems, mockSalesEmployees } from '../api/salesData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
const fetchSalesQuotations = async (filters?: SalesQuotationFilters): Promise<SalesQuotation[]> => {
  await delay(800);
  
  let filteredQuotations = [...mockSalesQuotations];
  
  if (filters) {
    if (filters.status && filters.status.length > 0) {
      filteredQuotations = filteredQuotations.filter(quot => filters.status!.includes(quot.status));
    }
    
    if (filters.customer) {
      filteredQuotations = filteredQuotations.filter(quot => 
        quot.customerName.toLowerCase().includes(filters.customer!.toLowerCase()) ||
        quot.customerCode.toLowerCase().includes(filters.customer!.toLowerCase())
      );
    }
    
    if (filters.dateFrom) {
      filteredQuotations = filteredQuotations.filter(quot => quot.postingDate >= filters.dateFrom!);
    }
    
    if (filters.dateTo) {
      filteredQuotations = filteredQuotations.filter(quot => quot.postingDate <= filters.dateTo!);
    }
  }
  
  return filteredQuotations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const fetchSalesQuotationById = async (id: string): Promise<SalesQuotation | null> => {
  await delay(400);
  return mockSalesQuotations.find(quot => quot.id === id) || null;
};

const fetchCustomers = async (): Promise<Customer[]> => {
  await delay(300);
  return mockCustomers;
};

const fetchItems = async (search?: string): Promise<Item[]> => {
  await delay(400);
  
  if (!search) return mockItems;
  
  const searchLower = search.toLowerCase();
  return mockItems.filter(item => 
    item.no.toLowerCase().includes(searchLower) ||
    item.name.toLowerCase().includes(searchLower) ||
    item.description.toLowerCase().includes(searchLower)
  );
};

const fetchSalesEmployees = async (): Promise<SalesEmployee[]> => {
  await delay(300);
  return mockSalesEmployees;
};

const createSalesQuotation = async (quotation: Omit<SalesQuotation, 'id' | 'createdAt' | 'updatedAt'>): Promise<SalesQuotation> => {
  await delay(1000);
  
  const newQuotation: SalesQuotation = {
    ...quotation,
    id: `quot-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockSalesQuotations.unshift(newQuotation);
  return newQuotation;
};

const updateSalesQuotation = async (id: string, updates: Partial<SalesQuotation>): Promise<SalesQuotation> => {
  await delay(800);
  
  const index = mockSalesQuotations.findIndex(quot => quot.id === id);
  if (index === -1) {
    throw new Error('Sales quotation not found');
  }
  
  const updatedQuotation = {
    ...mockSalesQuotations[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  mockSalesQuotations[index] = updatedQuotation;
  return updatedQuotation;
};

// Mock API functions for Sales Orders
const fetchSalesOrders = async (filters?: SalesOrderFilters): Promise<SalesOrder[]> => {
  await delay(800);
  
  let filteredOrders = [...mockSalesOrders];
  
  if (filters) {
    if (filters.status && filters.status.length > 0) {
      filteredOrders = filteredOrders.filter(order => filters.status!.includes(order.status));
    }
    
    if (filters.customer) {
      filteredOrders = filteredOrders.filter(order => 
        order.customerName.toLowerCase().includes(filters.customer!.toLowerCase()) ||
        order.customerCode.toLowerCase().includes(filters.customer!.toLowerCase())
      );
    }
    
    if (filters.dateFrom) {
      filteredOrders = filteredOrders.filter(order => order.postingDate >= filters.dateFrom!);
    }
    
    if (filters.dateTo) {
      filteredOrders = filteredOrders.filter(order => order.postingDate <= filters.dateTo!);
    }
  }
  
  return filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const fetchSalesOrderById = async (id: string): Promise<SalesOrder | null> => {
  await delay(400);
  return mockSalesOrders.find(order => order.id === id) || null;
};

const createSalesOrder = async (order: Omit<SalesOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<SalesOrder> => {
  await delay(1000);
  
  const newOrder: SalesOrder = {
    ...order,
    id: `order-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockSalesOrders.unshift(newOrder);
  return newOrder;
};

const updateSalesOrder = async (id: string, updates: Partial<SalesOrder>): Promise<SalesOrder> => {
  await delay(800);
  
  const index = mockSalesOrders.findIndex(order => order.id === id);
  if (index === -1) {
    throw new Error('Sales order not found');
  }
  
  const updatedOrder = {
    ...mockSalesOrders[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  mockSalesOrders[index] = updatedOrder;
  return updatedOrder;
};

// Copy functionality
const fetchCopyableDocuments = async (documentType: DocumentType): Promise<CopyDocumentData[]> => {
  await delay(500);
  
  if (documentType === 'sales-quotation') {
    return mockSalesQuotations.map(quot => ({
      id: quot.id,
      documentNo: quot.documentNo,
      customerName: quot.customerName,
      postingDate: quot.postingDate,
      total: quot.total,
      status: quot.status
    }));
  } else if (documentType === 'sales-order') {
    return mockSalesOrders.map(order => ({
      id: order.id,
      documentNo: order.documentNo,
      customerName: order.customerName,
      postingDate: order.postingDate,
      total: order.total,
      status: order.status
    }));
  }
  
  return [];
};

// Custom hooks
export const useSalesQuotations = (filters?: SalesQuotationFilters) => {
  return useQuery({
    queryKey: ['salesQuotations', filters],
    queryFn: () => fetchSalesQuotations(filters),
    staleTime: 30000,
  });
};

export const useSalesQuotation = (id: string) => {
  return useQuery({
    queryKey: ['salesQuotation', id],
    queryFn: () => fetchSalesQuotationById(id),
    enabled: !!id,
    staleTime: 60000,
  });
};

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
    staleTime: 300000, // 5 minutes
  });
};

export const useItems = (search?: string) => {
  return useQuery({
    queryKey: ['items', search],
    queryFn: () => fetchItems(search),
    staleTime: 300000,
  });
};

export const useSalesEmployees = () => {
  return useQuery({
    queryKey: ['salesEmployees'],
    queryFn: fetchSalesEmployees,
    staleTime: 300000,
  });
};

export const useCreateSalesQuotation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createSalesQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesQuotations'] });
    },
  });
};

export const useUpdateSalesQuotation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<SalesQuotation> }) => 
      updateSalesQuotation(id, updates),
    onSuccess: (updatedQuotation) => {
      queryClient.invalidateQueries({ queryKey: ['salesQuotations'] });
      queryClient.setQueryData(['salesQuotation', updatedQuotation.id], updatedQuotation);
    },
  });
};

// Sales Order hooks
export const useSalesOrders = (filters?: SalesOrderFilters) => {
  return useQuery({
    queryKey: ['salesOrders', filters],
    queryFn: () => fetchSalesOrders(filters),
    staleTime: 30000,
  });
};

export const useSalesOrder = (id: string) => {
  return useQuery({
    queryKey: ['salesOrder', id],
    queryFn: () => fetchSalesOrderById(id),
    enabled: !!id,
    staleTime: 60000,
  });
};

export const useCreateSalesOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createSalesOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesOrders'] });
    },
  });
};

export const useUpdateSalesOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<SalesOrder> }) => 
      updateSalesOrder(id, updates),
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: ['salesOrders'] });
      queryClient.setQueryData(['salesOrder', updatedOrder.id], updatedOrder);
    },
  });
};

// Copy functionality hooks
export const useCopyableDocuments = (documentType: DocumentType) => {
  return useQuery({
    queryKey: ['copyableDocuments', documentType],
    queryFn: () => fetchCopyableDocuments(documentType),
    enabled: false, // Only fetch when explicitly requested
    staleTime: 60000,
  });
};