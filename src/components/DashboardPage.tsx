import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardStats } from './DashboardStats';
import { IncomingOrdersWidget } from './widgets/IncomingOrdersWidget';
import { IncomingPaymentsWidget } from './widgets/IncomingPaymentsWidget';
import { SalesHistoryWidget } from './widgets/SalesHistoryWidget';
import { TopCustomersWidget } from './widgets/TopCustomersWidget';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

export const DashboardPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Distribution Dashboard</h1>
            <p className="text-gray-600">Monitor your sales, orders, and business performance</p>
          </div>

          {/* Stats Cards */}
          <DashboardStats />

          {/* Main Widgets Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Incoming Orders Widget */}
            <div className="lg:col-span-1">
              <IncomingOrdersWidget />
            </div>

            {/* Incoming Payments Widget */}
            <div className="lg:col-span-1">
              <IncomingPaymentsWidget />
            </div>

            {/* Sales History Widget */}
            <div className="lg:col-span-1">
              <SalesHistoryWidget />
            </div>

            {/* Top Customers Widget */}
            <div className="lg:col-span-1">
              <TopCustomersWidget />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Dashboard last updated: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
};