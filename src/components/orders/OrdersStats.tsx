import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  ShoppingCart, 
  CheckCircle, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle2,
  XCircle,
  DollarSign
} from 'lucide-react';
import { useOrderStats } from '../../hooks/useOrdersData';
import { LoadingSpinner } from '../ui/loading-spinner';

export const OrdersStats: React.FC = () => {
  const { data: stats, isLoading } = useOrderStats();

  const statCards = [
    {
      title: 'Total Orders',
      value: stats?.total || 0,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Confirmed',
      value: stats?.confirmed || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Approved',
      value: stats?.approved || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Preparing',
      value: stats?.preparing || 0,
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Ready for Pickup',
      value: stats?.readyForPickup || 0,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Dispatched',
      value: stats?.dispatched || 0,
      icon: Truck,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Fulfilled',
      value: stats?.fulfilled || 0,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Cancelled',
      value: stats?.cancelled || 0,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-gray-600 leading-tight">
              {stat.title}
            </CardTitle>
            <div className={`p-1.5 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-3 w-3 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <div className="text-lg font-bold">{stat.value}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};