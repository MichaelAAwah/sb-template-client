import { create } from 'zustand';

interface DashboardState {
  // Incoming Orders Widget State
  ordersViewMode: 'table' | 'chart';
  isOrdersLoading: boolean;
  lastOrdersRefresh: Date | null;
  
  // Incoming Payments Widget State
  isPaymentsLoading: boolean;
  lastPaymentsRefresh: Date | null;
  
  // Sales History Widget State
  isSalesLoading: boolean;
  
  // Top Customers Widget State
  customersViewMode: 'bar' | 'pie';
  isCustomersLoading: boolean;
  
  // Actions
  setOrdersViewMode: (mode: 'table' | 'chart') => void;
  setOrdersLoading: (loading: boolean) => void;
  setOrdersRefresh: () => void;
  setPaymentsLoading: (loading: boolean) => void;
  setPaymentsRefresh: () => void;
  setSalesLoading: (loading: boolean) => void;
  setCustomersViewMode: (mode: 'bar' | 'pie') => void;
  setCustomersLoading: (loading: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  // Initial state
  ordersViewMode: 'table',
  isOrdersLoading: false,
  lastOrdersRefresh: null,
  isPaymentsLoading: false,
  lastPaymentsRefresh: null,
  isSalesLoading: false,
  customersViewMode: 'bar',
  isCustomersLoading: false,
  
  // Actions
  setOrdersViewMode: (mode) => set({ ordersViewMode: mode }),
  setOrdersLoading: (loading) => set({ isOrdersLoading: loading }),
  setOrdersRefresh: () => set({ lastOrdersRefresh: new Date() }),
  setPaymentsLoading: (loading) => set({ isPaymentsLoading: loading }),
  setPaymentsRefresh: () => set({ lastPaymentsRefresh: new Date() }),
  setSalesLoading: (loading) => set({ isSalesLoading: loading }),
  setCustomersViewMode: (mode) => set({ customersViewMode: mode }),
  setCustomersLoading: (loading) => set({ isCustomersLoading: loading }),
}));