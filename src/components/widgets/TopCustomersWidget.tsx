import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users } from 'lucide-react';
import { useTopCustomers } from '../../hooks/useDashboardData';
import { useDashboardStore } from '../../store/dashboardStore';
import { LoadingSpinner } from '../ui/loading-spinner';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'];

export const TopCustomersWidget: React.FC = () => {
  const { data: customers, isLoading } = useTopCustomers();
  const { customersViewMode, setCustomersViewMode } = useDashboardStore();

  const formatTooltipValue = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const totalSales = customers?.reduce((sum, customer) => sum + customer.sales, 0) || 0;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-purple-600" />
          <CardTitle className="text-lg font-semibold">Top 10 Customers</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Pie</span>
          <Switch
            checked={customersViewMode === 'bar'}
            onCheckedChange={(checked) => setCustomersViewMode(checked ? 'bar' : 'pie')}
          />
          <span className="text-sm text-gray-600">Bar</span>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Total Sales (Top 10)</p>
              <p className="text-xl font-bold text-purple-700">
                ${totalSales.toLocaleString()}
              </p>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {customersViewMode === 'bar' ? (
                  <BarChart data={customers} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip 
                      formatter={formatTooltipValue}
                      labelStyle={{ color: '#374151' }}
                    />
                    <Bar 
                      dataKey="sales" 
                      fill="#8B5CF6"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={customers}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="sales"
                      label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                    >
                      {customers?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={formatTooltipValue} />
                    <Legend />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};