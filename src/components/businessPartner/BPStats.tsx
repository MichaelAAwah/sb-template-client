import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, Building, TrendingUp, DollarSign } from 'lucide-react';
import { useBPStats } from '../../hooks/useBusinessPartnerData';
import { LoadingSpinner } from '../ui/loading-spinner';
import { formatBalance } from '../../api/businessPartnerData';

export const BPStats: React.FC = () => {
  const { data: stats, isLoading } = useBPStats();

  const statCards = [
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Vendors',
      value: stats?.totalVendors || 0,
      icon: Building,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Active Partners',
      value: stats?.activePartners || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Balance',
      value: formatBalance(stats?.totalBalance || 0, 'GHS'),
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
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