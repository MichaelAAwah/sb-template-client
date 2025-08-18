import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { X, Filter, Search } from 'lucide-react';
import { DatePicker } from '../ui/date-picker';
import { OrderFilters, OrderStatus, OrderChannel } from '../../types/orders';
import { useWarehouses } from '../../hooks/useOrdersData';

interface OrdersFiltersProps {
  filters: OrderFilters;
  onFiltersChange: (filters: OrderFilters) => void;
  onClearFilters: () => void;
}

export const OrdersFilters: React.FC<OrdersFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const { data: warehouses } = useWarehouses();
  const [dateFrom, setDateFrom] = React.useState<Date | undefined>(
    filters.dateFrom ? new Date(filters.dateFrom) : undefined
  );
  const [dateTo, setDateTo] = React.useState<Date | undefined>(
    filters.dateTo ? new Date(filters.dateTo) : undefined
  );

  const statusOptions: OrderStatus[] = [
    'Confirmed',
    'Approved', 
    'Preparing',
    'Ready for Pickup',
    'Dispatched',
    'Fulfilled',
    'Cancelled'
  ];

  const channelOptions: OrderChannel[] = ['USSD', 'Mobile Web', 'Field Agent'];

  const handleStatusToggle = (status: OrderStatus) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    onFiltersChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined
    });
  };

  const handleChannelToggle = (channel: OrderChannel) => {
    const currentChannels = filters.channel || [];
    const newChannels = currentChannels.includes(channel)
      ? currentChannels.filter(c => c !== channel)
      : [...currentChannels, channel];
    
    onFiltersChange({
      ...filters,
      channel: newChannels.length > 0 ? newChannels : undefined
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && 
    (Array.isArray(value) ? value.length > 0 : true)
  );

  const handleDateFromChange = (date: Date | undefined) => {
    setDateFrom(date);
    onFiltersChange({
      ...filters,
      dateFrom: date ? date.toISOString().split('T')[0] : undefined
    });
  };

  const handleDateToChange = (date: Date | undefined) => {
    setDateTo(date);
    onFiltersChange({
      ...filters,
      dateTo: date ? date.toISOString().split('T')[0] : undefined
    });
  };
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search and Date Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customer..."
                value={filters.customer || ''}
                onChange={(e) => onFiltersChange({ ...filters, customer: e.target.value || undefined })}
                className="pl-10"
              />
            </div>
            
            <DatePicker
              date={dateFrom}
              onDateChange={handleDateFromChange}
              placeholder="From date"
            />
            
            <DatePicker
              date={dateTo}
              onDateChange={handleDateToChange}
              placeholder="To date"
            />

            <Select
              value={filters.warehouse || ''}
              onValueChange={(value) => onFiltersChange({ ...filters, warehouse: value || undefined })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All warehouses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All warehouses</SelectItem>
                {warehouses?.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name} ({warehouse.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filters */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Order Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => {
                const isSelected = filters.status?.includes(status);
                return (
                  <Badge
                    key={status}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleStatusToggle(status)}
                  >
                    {status}
                    {isSelected && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Channel Filters */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Order Channel
            </label>
            <div className="flex flex-wrap gap-2">
              {channelOptions.map((channel) => {
                const isSelected = filters.channel?.includes(channel);
                return (
                  <Badge
                    key={channel}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleChannelToggle(channel)}
                  >
                    {channel}
                    {isSelected && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-between items-center pt-2 border-t">
              <p className="text-sm text-gray-600">
                {Object.values(filters).filter(v => v !== undefined && v !== '' && 
                  (Array.isArray(v) ? v.length > 0 : true)).length} filter(s) applied
              </p>
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};