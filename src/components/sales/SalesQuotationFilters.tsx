import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { X, Search } from 'lucide-react';
import { DatePicker } from '../ui/date-picker';
import { SalesQuotationFilters as FiltersType } from '../../types/sales';

interface SalesQuotationFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
  onClearFilters: () => void;
}

export const SalesQuotationFilters: React.FC<SalesQuotationFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const [dateFrom, setDateFrom] = React.useState<Date | undefined>(
    filters.dateFrom ? new Date(filters.dateFrom) : undefined
  );
  const [dateTo, setDateTo] = React.useState<Date | undefined>(
    filters.dateTo ? new Date(filters.dateTo) : undefined
  );

  const statusOptions: ('Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired')[] = [
    'Draft',
    'Sent',
    'Accepted',
    'Rejected',
    'Expired'
  ];

  const handleStatusToggle = (status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired') => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    onFiltersChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined
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

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Sent': 'bg-blue-100 text-blue-800',
      'Accepted': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Expired': 'bg-orange-100 text-orange-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search and Date Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>

          {/* Status Filters */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Quotation Status
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
                        : `hover:bg-gray-100 ${getStatusBadgeColor(status)}`
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