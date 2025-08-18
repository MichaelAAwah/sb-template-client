import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Order, Payment, SalesData, CustomerSales, DashboardStats } from '../types/dashboard';
import { mockOrders, mockPayments, mockSalesData, mockTopCustomers, mockStats } from '../api/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
const fetchOrders = async (): Promise<Order[]> => {
  await delay(1000);
  return mockOrders;
};

const fetchPayments = async (): Promise<Payment[]> => {
  await delay(800);
  return mockPayments;
};

const fetchSalesData = async (): Promise<SalesData[]> => {
  await delay(1200);
  return mockSalesData;
};

const fetchTopCustomers = async (): Promise<CustomerSales[]> => {
  await delay(900);
  return mockTopCustomers;
};

const fetchStats = async (): Promise<DashboardStats> => {
  await delay(600);
  return mockStats;
};

// Custom hooks
export const useOrders = (refetchInterval?: number): UseQueryResult<Order[], Error> => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    refetchInterval: refetchInterval || 30000, // Auto-refresh every 30 seconds
    staleTime: 10000,
  });
};

export const usePayments = (refetchInterval?: number): UseQueryResult<Payment[], Error> => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: fetchPayments,
    refetchInterval: refetchInterval || 30000,
    staleTime: 10000,
  });
};

export const useSalesData = (): UseQueryResult<SalesData[], Error> => {
  return useQuery({
    queryKey: ['salesData'],
    queryFn: fetchSalesData,
    staleTime: 300000, // 5 minutes
  });
};

export const useTopCustomers = (): UseQueryResult<CustomerSales[], Error> => {
  return useQuery({
    queryKey: ['topCustomers'],
    queryFn: fetchTopCustomers,
    staleTime: 300000,
  });
};

export const useStats = (): UseQueryResult<DashboardStats, Error> => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000,
  });
};