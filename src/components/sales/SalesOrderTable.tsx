import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Eye, Edit, Copy, Send, Trash2 } from 'lucide-react';
import { SalesOrder } from '../../types/sales';
import { format } from 'date-fns';
import { getCurrencySymbol } from '../../api/salesData';

interface SalesOrderTableProps {
  orders: SalesOrder[];
}

export const SalesOrderTable: React.FC<SalesOrderTableProps> = ({
  orders,
}) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Open': { className: 'bg-blue-100 text-blue-800' },
      'Released': { className: 'bg-green-100 text-green-800' },
      'Pending Approval': { className: 'bg-yellow-100 text-yellow-800' },
      'Pending Prepayment': { className: 'bg-orange-100 text-orange-800' },
      'Completely Shipped': { className: 'bg-emerald-100 text-emerald-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { className: 'bg-gray-100 text-gray-800' };
    return (
      <Badge variant="secondary" className={config.className}>
        {status}
      </Badge>
    );
  };

  const handleView = (order: SalesOrder) => {
    console.log('View order:', order.id);
  };

  const handleEdit = (order: SalesOrder) => {
    console.log('Edit order:', order.id);
  };

  const handleCopy = (order: SalesOrder) => {
    console.log('Copy order:', order.id);
  };

  const handleSend = (order: SalesOrder) => {
    console.log('Send order:', order.id);
  };

  const handleDelete = (order: SalesOrder) => {
    console.log('Delete order:', order.id);
  };

  const isOverdue = (deliveryDate: string) => {
    return new Date(deliveryDate) < new Date();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document No.</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Posting Date</TableHead>
            <TableHead>Delivery Date</TableHead>
            <TableHead>Total (GHS)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-muted/50">
              <TableCell className="font-mono text-sm font-medium">
                {order.documentNo}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm text-gray-500">{order.customerCode}</p>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(order.postingDate), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                <div className={isOverdue(order.requestedDeliveryDate) ? 'text-red-600' : ''}>
                  {format(new Date(order.requestedDeliveryDate), 'MMM dd, yyyy')}
                  {isOverdue(order.requestedDeliveryDate) && (
                    <span className="text-xs block">Overdue</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-semibold">
                {getCurrencySymbol(order.currency)}{order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(order)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(order)}
                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(order)}
                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  {order.status === 'Open' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSend(order)}
                      className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(order)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};