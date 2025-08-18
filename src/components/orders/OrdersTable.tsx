import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  Eye, 
  UserPlus, 
  XCircle, 
  Package, 
  Truck, 
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { Order, OrderStatus } from '../../types/orders';
import { format } from 'date-fns';

interface OrdersTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onAssignOrder: (order: Order) => void;
  onIssueOrder: (order: Order) => void;
  onDispatchOrder: (order: Order) => void;
  onFulfillOrder: (order: Order) => void;
  onCancelOrder: (order: Order) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onViewOrder,
  onAssignOrder,
  onIssueOrder,
  onDispatchOrder,
  onFulfillOrder,
  onCancelOrder,
}) => {
  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      'Confirmed': { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      'Approved': { variant: 'secondary' as const, className: 'bg-green-100 text-green-800' },
      'Preparing': { variant: 'secondary' as const, className: 'bg-orange-100 text-orange-800' },
      'Ready for Pickup': { variant: 'secondary' as const, className: 'bg-purple-100 text-purple-800' },
      'Dispatched': { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800' },
      'Fulfilled': { variant: 'default' as const, className: 'bg-emerald-100 text-emerald-800' },
      'Cancelled': { variant: 'secondary' as const, className: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  const getActionButtons = (order: Order) => {
    const buttons = [];

    // View Order - always available
    buttons.push(
      <Button
        key="view"
        variant="ghost"
        size="sm"
        onClick={() => onViewOrder(order)}
        className="h-8 w-8 p-0"
      >
        <Eye className="h-4 w-4" />
      </Button>
    );

    // Status-specific actions
    switch (order.status) {
      case 'Confirmed':
      case 'Approved':
        buttons.push(
          <Button
            key="assign"
            variant="ghost"
            size="sm"
            onClick={() => onAssignOrder(order)}
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        );
        buttons.push(
          <Button
            key="cancel"
            variant="ghost"
            size="sm"
            onClick={() => onCancelOrder(order)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        );
        break;

      case 'Preparing':
        buttons.push(
          <Button
            key="issue"
            variant="ghost"
            size="sm"
            onClick={() => onIssueOrder(order)}
            className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
          >
            <Package className="h-4 w-4" />
          </Button>
        );
        break;

      case 'Ready for Pickup':
        buttons.push(
          <Button
            key="dispatch"
            variant="ghost"
            size="sm"
            onClick={() => onDispatchOrder(order)}
            className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700"
          >
            <Truck className="h-4 w-4" />
          </Button>
        );
        break;

      case 'Dispatched':
        buttons.push(
          <Button
            key="fulfill"
            variant="ghost"
            size="sm"
            onClick={() => onFulfillOrder(order)}
            className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
          >
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        );
        break;
    }

    return buttons;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Order No.</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Channel</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                {format(new Date(order.date), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>{order.time}</TableCell>
              <TableCell className="font-mono text-sm">{order.orderNo}</TableCell>
              <TableCell>{order.customer.name}</TableCell>
              <TableCell className="font-semibold">
                ${order.totalAmount.toLocaleString()}
              </TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell>
                {order.warehouse ? (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-sm">{order.warehouse.code}</span>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">Not assigned</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {order.channel}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-1">
                  {getActionButtons(order)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};