import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  Package,
  Calendar,
  Clock,
  Truck
} from 'lucide-react';
import { Order } from '../../types/orders';
import { format } from 'date-fns';

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  open,
  onOpenChange,
}) => {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    const colors = {
      'Confirmed': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Preparing': 'bg-orange-100 text-orange-800',
      'Ready for Pickup': 'bg-purple-100 text-purple-800',
      'Dispatched': 'bg-blue-100 text-blue-800',
      'Fulfilled': 'bg-emerald-100 text-emerald-800',
      'Cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-green-100 text-green-800',
      'Failed': 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details - {order.orderNo}</span>
            <Badge variant="secondary" className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Order Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Order No.</p>
                  <p className="font-mono">{order.orderNo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Channel</p>
                  <Badge variant="outline">{order.channel}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date</p>
                  <p>{format(new Date(order.date), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Time</p>
                  <p>{order.time}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-lg font-bold">${order.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Items Count</p>
                  <p>{order.items.length} items</p>
                </div>
              </div>

              {order.eta && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Expected Delivery</p>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p>{format(new Date(order.eta), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
              )}

              {order.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Notes</p>
                  <p className="text-sm bg-gray-50 p-2 rounded">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Customer Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="font-semibold">{order.customer.name}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone</p>
                  <p>{order.customer.phone}</p>
                </div>
              </div>

              {order.customer.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p>{order.customer.email}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Address</p>
                  <p>{order.customer.address}</p>
                  <p className="text-sm text-gray-500">
                    {order.customer.location.district}, {order.customer.location.region}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Method</p>
                  <Badge variant="outline">{order.payment.method}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge variant="secondary" className={getPaymentStatusColor(order.payment.status)}>
                    {order.payment.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Amount</p>
                  <p className="font-semibold">${order.payment.amount.toLocaleString()}</p>
                </div>
                {order.payment.transactionId && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Transaction ID</p>
                    <p className="font-mono text-sm">{order.payment.transactionId}</p>
                  </div>
                )}
              </div>

              {order.payment.paidAt && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Paid At</p>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <p>{format(new Date(order.payment.paidAt), 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Warehouse Information */}
          {order.warehouse && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span>Warehouse Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Warehouse</p>
                  <p className="font-semibold">{order.warehouse.name}</p>
                  <p className="text-sm text-gray-500">Code: {order.warehouse.code}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Manager</p>
                  <p>{order.warehouse.manager}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Phone</p>
                    <p>{order.warehouse.phone}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Address</p>
                    <p>{order.warehouse.address}</p>
                  </div>
                </div>

                {order.assignedAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Assigned At</p>
                    <p>{format(new Date(order.assignedAt), 'MMM dd, yyyy HH:mm')}</p>
                    {order.assignedBy && (
                      <p className="text-sm text-gray-500">by {order.assignedBy}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Items */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead className="text-right">Total Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ${item.totalPrice.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={4} className="font-semibold">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg">
                      ${order.totalAmount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};