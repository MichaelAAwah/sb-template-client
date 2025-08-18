import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { FileText } from 'lucide-react';
import { useBPTransactions } from '../../hooks/useBusinessPartnerData';
import { LoadingSpinner } from '../ui/loading-spinner';
import { formatBalance } from '../../api/businessPartnerData';
import { format } from 'date-fns';

interface BPTransactionsTabProps {
  businessPartnerId: string;
}

export const BPTransactionsTab: React.FC<BPTransactionsTabProps> = ({
  businessPartnerId,
}) => {
  const { data: transactions, isLoading } = useBPTransactions(businessPartnerId);

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

  // Calculate summary
  const totalDebit = transactions?.reduce((sum, txn) => sum + txn.debit, 0) || 0;
  const totalCredit = transactions?.reduce((sum, txn) => sum + txn.credit, 0) || 0;
  const netBalance = totalDebit - totalCredit;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Debits</p>
              <p className="text-lg font-bold text-red-600">₵{totalDebit.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Credits</p>
              <p className="text-lg font-bold text-green-600">₵{totalCredit.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Net Balance</p>
              <p className={`text-lg font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₵{netBalance.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-lg font-bold text-blue-600">{transactions?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : transactions && transactions.length > 0 ? (
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
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-muted/50">
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
                            ₵{transaction.debit.toLocaleString()}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {transaction.credit > 0 && (
                          <span className="text-green-600 font-semibold">
                            ₵{transaction.credit.toLocaleString()}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className={`font-semibold ${transaction.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₵{transaction.balance.toLocaleString()}
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
              <p>No transactions found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};