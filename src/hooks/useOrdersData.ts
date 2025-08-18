import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Order, OrderFilters, OrderStats, WarehouseInfo } from '../types/orders';
import { mockOrders, mockOrderStats, mockWarehouses } from '../api/ordersData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
const fetchOrders = async (filters?: OrderFilters): Promise<Order[]> => {
  await delay(800);
  
  let filteredOrders = [...mockOrders];
  
  if (filters) {
    if (filters.status && filters.status.length > 0) {
      filteredOrders = filteredOrders.filter(order => filters.status!.includes(order.status));
    }
    
    if (filters.customer) {
      filteredOrders = filteredOrders.filter(order => 
        order.customer.name.toLowerCase().includes(filters.customer!.toLowerCase())
      );
    }
    
    if (filters.warehouse) {
      filteredOrders = filteredOrders.filter(order => 
        order.warehouse?.id === filters.warehouse
      );
    }
    
    if (filters.channel && filters.channel.length > 0) {
      filteredOrders = filteredOrders.filter(order => filters.channel!.includes(order.channel));
    }
    
    if (filters.dateFrom) {
      filteredOrders = filteredOrders.filter(order => order.date >= filters.dateFrom!);
    }
    
    if (filters.dateTo) {
      filteredOrders = filteredOrders.filter(order => order.date <= filters.dateTo!);
    }
  }
  
  return filteredOrders.sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());
};

const fetchOrderById = async (id: string): Promise<Order | null> => {
  await delay(400);
  return mockOrders.find(order => order.id === id) || null;
};

const fetchOrderStats = async (): Promise<OrderStats> => {
  await delay(600);
  return mockOrderStats;
};

const fetchWarehouses = async (): Promise<WarehouseInfo[]> => {
  await delay(300);
  return mockWarehouses;
};

// Mock mutation functions
const assignOrder = async ({ orderId, warehouseId, eta }: { orderId: string; warehouseId: string; eta: string }): Promise<Order> => {
  await delay(1000);
  
  const order = mockOrders.find(o => o.id === orderId);
  const warehouse = mockWarehouses.find(w => w.id === warehouseId);
  
  if (!order || !warehouse) {
    throw new Error('Order or warehouse not found');
  }
  
  // Update the order in mock data
  const updatedOrder = {
    ...order,
    status: 'Preparing' as const,
    warehouse,
    eta,
    assignedAt: new Date().toISOString(),
    assignedBy: 'Current User'
  };
  
  const index = mockOrders.findIndex(o => o.id === orderId);
  if (index !== -1) {
    mockOrders[index] = updatedOrder;
  }
  
  return updatedOrder;
};

const updateOrderStatus = async ({ orderId, status, notes }: { orderId: string; status: string; notes?: string }): Promise<Order> => {
  await delay(800);
  
  const order = mockOrders.find(o => o.id === orderId);
  if (!order) {
    throw new Error('Order not found');
  }
  
  const now = new Date().toISOString();
  const updatedOrder = { ...order, status: status as any, notes };
  
  // Add timestamps based on status
  switch (status) {
    case 'Ready for Pickup':
      updatedOrder.issuedAt = now;
      break;
    case 'Dispatched':
      updatedOrder.dispatchedAt = now;
      break;
    case 'Fulfilled':
      updatedOrder.fulfilledAt = now;
      break;
    case 'Cancelled':
      updatedOrder.cancelledAt = now;
      updatedOrder.cancelReason = notes || 'Cancelled by user';
      break;
  }
  
  const index = mockOrders.findIndex(o => o.id === orderId);
  if (index !== -1) {
    mockOrders[index] = updatedOrder;
  }
  
  return updatedOrder;
};

// Custom hooks
export const useOrders = (filters?: OrderFilters) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => fetchOrders(filters),
    staleTime: 30000,
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrderById(id),
    enabled: !!id,
    staleTime: 60000,
  });
};

export const useOrderStats = () => {
  return useQuery({
    queryKey: ['orderStats'],
    queryFn: fetchOrderStats,
    staleTime: 60000,
  });
};

export const useWarehouses = () => {
  return useQuery({
    queryKey: ['warehouses'],
    queryFn: fetchWarehouses,
    staleTime: 300000, // 5 minutes
  });
};

export const useAssignOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: assignOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orderStats'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orderStats'] });
      queryClient.setQueryData(['order', updatedOrder.id], updatedOrder);
    },
  });
};