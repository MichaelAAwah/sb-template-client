import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { RefreshCw, DollarSign } from 'lucide-react';
import { usePayments } from '../../hooks/useDashboardData';
import { useDashboardStore } from '../../store/dashboardStore';
import { LoadingSpinner } from '../ui/loading-spinner';
import { format } from 'date-fns';

export const IncomingPaymentsWidget: React.FC = () => {
  const { data: payments, isLoading, refetch, isFetching } = usePayments();
  const { setPaymentsRefresh } = useDashboardStore();

  const handleRefresh = async () => {
    setPaymentsRefresh();
    await refetch();
  };

  const displayPayments = payments?.slice(0, 10) || [];
  const totalAmount = displayPayments.reduce((sum, payment) => sum + payment.amount, 0);

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case 'Cash':
        return 'bg-green-100 text-green-800';
      case 'Mobile Money':
        return 'bg-blue-100 text-blue-800';
      case 'Bank Transfer':
        return 'bg-purple-100 text-purple-800';
      default:
        return '';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <CardTitle className="text-lg font-semibold">Incoming Payments</CardTitle>
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
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-green-600 font-medium">Today's Total</p>
                <p className="text-2xl font-bold text-green-700">${totalAmount.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-xl font-semibold text-gray-800">{displayPayments.length}</p>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Order No.</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {format(new Date(payment.date), 'MMM dd')}
                      </TableCell>
                      <TableCell>{payment.time}</TableCell>
                      <TableCell>{payment.orderNo}</TableCell>
                      <TableCell>{payment.customerName}</TableCell>
                      <TableCell className="font-semibold">
                        ${payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={getMethodBadgeColor(payment.method)}
                        >
                          {payment.method}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <p className="text-sm text-gray-600 text-center">
              Showing latest {displayPayments.length} successful payments
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};