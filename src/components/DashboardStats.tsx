import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, ShoppingCart, DollarSign, Users } from 'lucide-react';
import { useStats } from '../hooks/useDashboardData';
import { LoadingSpinner } from './ui/loading-spinner';

export const DashboardStats: React.FC = () => {
  const { data: stats, isLoading } = useStats();

  const statCards = [
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Payments',
      value: stats?.totalPayments || 0,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Revenue',
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Active Customers',
      value: stats?.activeCustomers || 0,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <div className="text-2xl font-bold">{stat.value}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};