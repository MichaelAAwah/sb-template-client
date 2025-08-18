import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { LoadingSpinner } from '../ui/loading-spinner';
import { MapPin, Calendar, User } from 'lucide-react';
import { Order } from '../../types/orders';
import { DatePicker } from '../ui/date-picker';
import { useWarehouses, useAssignOrder } from '../../hooks/useOrdersData';
import { format } from 'date-fns';

interface AssignOrderDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AssignOrderDialog: React.FC<AssignOrderDialogProps> = ({
  order,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [eta, setEta] = useState<Date | undefined>();
  
  const { data: warehouses, isLoading: warehousesLoading } = useWarehouses();
  const assignOrderMutation = useAssignOrder();

  // Set default ETA to 3 days from now
  React.useEffect(() => {
    if (open && !eta) {
      const defaultEta = new Date();
      defaultEta.setDate(defaultEta.getDate() + 3);
      setEta(defaultEta);
    }
  }, [open, eta]);

  const handleAssign = async () => {
    if (!order || !selectedWarehouse || !eta) return;

    try {
      await assignOrderMutation.mutateAsync({
        orderId: order.id,
        warehouseId: selectedWarehouse,
        eta: eta.toISOString().split('T')[0],
      });
      
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setSelectedWarehouse('');
      setEta(undefined);
    } catch (error) {
      console.error('Failed to assign order:', error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedWarehouse('');
    setEta(undefined);
  };

  if (!order) return null;

  const selectedWarehouseData = warehouses?.find(w => w.id === selectedWarehouse);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Order to Warehouse</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="font-semibold">${order.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {order.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Form */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Warehouse
              </label>
              {warehousesLoading ? (
                <div className="flex items-center justify-center h-10">
                  <LoadingSpinner size="sm" />
                </div>
              ) : (
                <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a warehouse..." />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses?.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{warehouse.name} ({warehouse.code})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {selectedWarehouseData && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">
                        <strong>Manager:</strong> {selectedWarehouseData.manager}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">
                        <strong>Address:</strong> {selectedWarehouseData.address}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Expected Delivery Date (ETA)
              </label>
              <DatePicker
                date={eta}
                onDateChange={setEta}
                placeholder="Select delivery date"
              />
              {eta && (
                <p className="text-sm text-gray-600 mt-1">
                  Delivery expected on {format(eta, 'MMMM dd, yyyy')}
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedWarehouse || !eta || assignOrderMutation.isPending}
          >
            {assignOrderMutation.isPending ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Assigning...
              </>
            ) : (
              'Assign Order'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};