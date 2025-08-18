import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, ShoppingCart } from 'lucide-react';
import { useSalesOrders } from '../../hooks/useSalesData';
import { LoadingSpinner } from '../ui/loading-spinner';
import { format } from 'date-fns';
import { getCurrencySymbol } from '../../api/salesData';

export const SalesOrderRecents: React.FC = () => {
  const { data: orders, isLoading } = useSalesOrders();

  const recentOrders = orders?.slice(0, 10) || [];

  const getStatusColor = (status: string) => {
    const colors = {
      'Open': 'bg-blue-100 text-blue-800',
      'Released': 'bg-green-100 text-green-800',
      'Pending Approval': 'bg-yellow-100 text-yellow-800',
      'Pending Prepayment': 'bg-orange-100 text-orange-800',
      'Completely Shipped': 'bg-emerald-100 text-emerald-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Recent Orders</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner size="sm" />
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-4 w-4 text-gray-400" />
                    <span className="font-mono text-sm font-medium">
                      {order.documentNo}
                    </span>
                  </div>
                  <Badge variant="secondary" className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {order.customerName}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{format(new Date(order.postingDate), 'MMM dd')}</span>
                    <span className="font-semibold">
                      {getCurrencySymbol(order.currency)}{order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ShoppingCart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No recent orders</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};