import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { LoadingSpinner } from '../ui/loading-spinner';
import { RefreshCw, Package, Plus } from 'lucide-react';
import { OrdersStats } from './OrdersStats';
import { OrdersFilters } from './OrdersFilters';
import { OrdersTable } from './OrdersTable';
import { OrderDetailsDialog } from './OrderDetailsDialog';
import { AssignOrderDialog } from './AssignOrderDialog';
import { OrderActionDialog } from './OrderActionDialog';
import { OrderCreationPage } from './OrderCreationPage';
import { useOrders } from '../../hooks/useOrdersData';
import { Order, OrderFilters } from '../../types/orders';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

const OrdersCenterContent: React.FC = () => {
  const [filters, setFilters] = useState<OrderFilters>({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [currentAction, setCurrentAction] = useState<'issue' | 'dispatch' | 'fulfill' | 'cancel' | null>(null);
  const [showCreateOrder, setShowCreateOrder] = useState(false);

  const { data: orders, isLoading, refetch, isFetching } = useOrders(filters);

  const handleRefresh = () => {
    refetch();
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleAssignOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowAssignDialog(true);
  };

  const handleOrderAction = (order: Order, action: 'issue' | 'dispatch' | 'fulfill' | 'cancel') => {
    setSelectedOrder(order);
    setCurrentAction(action);
    setShowActionDialog(true);
  };

  const handleActionSuccess = () => {
    refetch();
  };

  // Show creation page if requested
  if (showCreateOrder) {
    return <OrderCreationPage onBack={() => setShowCreateOrder(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Orders Center</h1>
                <p className="text-gray-600">Manage customer orders from placement to delivery</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowCreateOrder(true)}
                className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Order</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isFetching}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <OrdersStats />

        {/* Filters */}
        <OrdersFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Orders Management</span>
              <div className="text-sm font-normal text-gray-600">
                {orders ? `${orders.length} orders` : 'Loading...'}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : orders && orders.length > 0 ? (
              <OrdersTable
                orders={orders}
                onViewOrder={handleViewOrder}
                onAssignOrder={handleAssignOrder}
                onIssueOrder={(order) => handleOrderAction(order, 'issue')}
                onDispatchOrder={(order) => handleOrderAction(order, 'dispatch')}
                onFulfillOrder={(order) => handleOrderAction(order, 'fulfill')}
                onCancelOrder={(order) => handleOrderAction(order, 'cancel')}
              />
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600">
                  {Object.keys(filters).length > 0 
                    ? 'Try adjusting your filters to see more orders.'
                    : 'Orders will appear here once customers start placing them.'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialogs */}
        <OrderDetailsDialog
          order={selectedOrder}
          open={showOrderDetails}
          onOpenChange={setShowOrderDetails}
        />

        <AssignOrderDialog
          order={selectedOrder}
          open={showAssignDialog}
          onOpenChange={setShowAssignDialog}
          onSuccess={handleActionSuccess}
        />

        <OrderActionDialog
          order={selectedOrder}
          action={currentAction}
          open={showActionDialog}
          onOpenChange={setShowActionDialog}
          onSuccess={handleActionSuccess}
        />
      </div>
    </div>
  );
};

export const OrdersCenterPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <OrdersCenterContent />
    </QueryClientProvider>
  );
};
