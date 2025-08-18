import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Switch } from '../ui/switch';
import { RefreshCw, Eye, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useOrders } from '../../hooks/useDashboardData';
import { useDashboardStore } from '../../store/dashboardStore';
import { LoadingSpinner } from '../ui/loading-spinner';
import { format } from 'date-fns';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export const IncomingOrdersWidget: React.FC = () => {
  const { data: orders, isLoading, refetch, isFetching } = useOrders();
  const { 
    ordersViewMode, 
    setOrdersViewMode, 
    setOrdersRefresh 
  } = useDashboardStore();

  const handleRefresh = async () => {
    setOrdersRefresh();
    await refetch();
  };

  const handleViewMore = () => {
    // Navigate to full orders list - placeholder for routing
    console.log('Navigate to full orders list');
  };

  // Prepare data for pie chart
  const pieData = orders ? [
    { name: 'USSD', value: orders.filter(o => o.channel === 'USSD').length },
    { name: 'Mobile Web', value: orders.filter(o => o.channel === 'Mobile Web').length },
    { name: 'Confirmed', value: orders.filter(o => o.status === 'Confirmed').length },
    { name: 'Paid', value: orders.filter(o => o.status === 'Paid').length },
  ].filter(item => item.value > 0) : [];

  const displayOrders = orders?.slice(0, 10) || [];

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg font-semibold">Incoming Orders</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Chart</span>
            <Switch
              checked={ordersViewMode === 'table'}
              onCheckedChange={(checked) => setOrdersViewMode(checked ? 'table' : 'chart')}
            />
            <span className="text-sm text-gray-600">Table</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : ordersViewMode === 'table' ? (
          <div className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Order No.</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Item Type</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {format(new Date(order.date), 'MMM dd')}
                      </TableCell>
                      <TableCell>{order.orderNo}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{order.itemType}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>${order.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={order.status === 'Paid' ? 'default' : 'secondary'}
                          className={order.status === 'Paid' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {displayOrders.length} of {orders?.length || 0} orders
              </p>
              <Button variant="outline" size="sm" onClick={handleViewMore}>
                <Eye className="h-4 w-4 mr-2" />
                View More
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};