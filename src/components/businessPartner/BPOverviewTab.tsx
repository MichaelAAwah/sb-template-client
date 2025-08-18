import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Clock, TrendingUp, FileText, ShoppingCart } from 'lucide-react';
import { BusinessPartner } from '../../types/businessPartner';
import { useBPTransactions } from '../../hooks/useBusinessPartnerData';
import { LoadingSpinner } from '../ui/loading-spinner';
import { formatBalance } from '../../api/businessPartnerData';
import { format } from 'date-fns';

interface BPOverviewTabProps {
  businessPartner: BusinessPartner;
}

export const BPOverviewTab: React.FC<BPOverviewTabProps> = ({
  businessPartner,
}) => {
  const { data: transactions, isLoading } = useBPTransactions(businessPartner.id);

  const recentTransactions = transactions?.slice(0, 5) || [];
  
  // Mock summary data - in real app this would come from API
  const summaryData = {
    salesThisYear: 45000,
    pendingSalesOrders: { count: 3, value: 12500 },
    lastPaymentDate: '2024-01-15',
    averageOrderValue: 2800,
  };

  const getTransactionTypeColor = (type: string) => {
    const colors = {
      'Invoice': 'bg-blue-100 text-blue-800',
      'Payment': 'bg-green-100 text-green-800',
      'Credit Note': 'bg-orange-100 text-orange-800',
      'Debit Note': 'bg-red-100 text-red-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Open': 'bg-yellow-100 text-yellow-800',
      'Paid': 'bg-green-100 text-green-800',
      'Overdue': 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Transaction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Sales This Year</p>
                <p className="text-lg font-bold text-green-600">
                  {formatBalance(summaryData.salesThisYear, businessPartner.masterData.currency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-lg font-bold text-blue-600">
                  {summaryData.pendingSalesOrders.count}
                </p>
                <p className="text-xs text-gray-500">
                  {formatBalance(summaryData.pendingSalesOrders.value, businessPartner.masterData.currency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Last Payment</p>
                <p className="text-sm font-semibold text-purple-600">
                  {format(new Date(summaryData.lastPaymentDate), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <p className="text-lg font-bold text-orange-600">
                  {formatBalance(summaryData.averageOrderValue, businessPartner.masterData.currency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Transactions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <LoadingSpinner size="lg" />
            </div>
          ) : recentTransactions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Document No.</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Debit</TableHead>
                    <TableHead>Credit</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getTransactionTypeColor(transaction.type)}>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {transaction.documentNo}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        {transaction.debit > 0 && (
                          <span className="text-red-600 font-semibold">
                            {formatBalance(transaction.debit, businessPartner.masterData.currency)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {transaction.credit > 0 && (
                          <span className="text-green-600 font-semibold">
                            {formatBalance(transaction.credit, businessPartner.masterData.currency)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatBalance(transaction.balance, businessPartner.masterData.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p>No recent transactions</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};