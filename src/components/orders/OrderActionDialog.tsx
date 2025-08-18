import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { LoadingSpinner } from '../ui/loading-spinner';
import { AlertTriangle, Package, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { Order } from '../../types/orders';
import { useUpdateOrderStatus } from '../../hooks/useOrdersData';

interface OrderActionDialogProps {
  order: Order | null;
  action: 'issue' | 'dispatch' | 'fulfill' | 'cancel' | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const OrderActionDialog: React.FC<OrderActionDialogProps> = ({
  order,
  action,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [notes, setNotes] = useState<string>('');
  const updateOrderMutation = useUpdateOrderStatus();

  const getActionConfig = () => {
    switch (action) {
      case 'issue':
        return {
          title: 'Issue Order',
          description: 'Mark this order as ready for pickup from the warehouse.',
          newStatus: 'Ready for Pickup',
          icon: Package,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          buttonText: 'Issue Order',
          buttonColor: 'bg-orange-600 hover:bg-orange-700',
        };
      case 'dispatch':
        return {
          title: 'Dispatch Order',
          description: 'Mark this order as dispatched for delivery.',
          newStatus: 'Dispatched',
          icon: Truck,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          buttonText: 'Dispatch Order',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
        };
      case 'fulfill':
        return {
          title: 'Mark as Delivered',
          description: 'Confirm that this order has been successfully delivered to the customer.',
          newStatus: 'Fulfilled',
          icon: CheckCircle2,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          buttonText: 'Mark as Delivered',
          buttonColor: 'bg-green-600 hover:bg-green-700',
        };
      case 'cancel':
        return {
          title: 'Cancel Order',
          description: 'Cancel this order. This action cannot be undone.',
          newStatus: 'Cancelled',
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          buttonText: 'Cancel Order',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          requiresNotes: true,
        };
      default:
        return null;
    }
  };

  const handleAction = async () => {
    if (!order || !action) return;

    const config = getActionConfig();
    if (!config) return;

    if (config.requiresNotes && !notes.trim()) {
      return;
    }

    try {
      await updateOrderMutation.mutateAsync({
        orderId: order.id,
        status: config.newStatus,
        notes: notes.trim() || undefined,
      });
      
      onSuccess();
      onOpenChange(false);
      setNotes('');
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setNotes('');
  };

  if (!order || !action) return null;

  const config = getActionConfig();
  if (!config) return null;

  const { title, description, newStatus, icon: Icon, color, bgColor, buttonText, buttonColor, requiresNotes } = config;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className={`p-2 rounded-full ${bgColor}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <span>{title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Order No.</p>
                  <p className="font-mono">{order.orderNo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Customer</p>
                  <p>{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Status</p>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                    {order.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">New Status</p>
                  <Badge variant="secondary" className={`${bgColor} ${color.replace('text-', 'text-')}`}>
                    {newStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Description */}
          <div className={`p-4 rounded-lg ${bgColor} border border-current border-opacity-20`}>
            <p className="text-sm">{description}</p>
          </div>

          {/* Warning for Cancel */}
          {action === 'cancel' && (
            <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Warning</p>
                <p className="text-sm text-red-700">
                  This action cannot be undone. The order will be permanently cancelled.
                </p>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              {requiresNotes ? 'Cancellation Reason *' : 'Notes (Optional)'}
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                requiresNotes 
                  ? 'Please provide a reason for cancelling this order...'
                  : 'Add any additional notes...'
              }
              rows={3}
            />
            {requiresNotes && !notes.trim() && (
              <p className="text-sm text-red-600 mt-1">
                Cancellation reason is required
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAction}
            disabled={
              updateOrderMutation.isPending || 
              (requiresNotes && !notes.trim())
            }
            className={buttonColor}
          >
            {updateOrderMutation.isPending ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Processing...
              </>
            ) : (
              buttonText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};