import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { X, Search } from 'lucide-react';
import { BPFilters as FiltersType } from '../../types/businessPartner';
import { useBPGroups } from '../../hooks/useBusinessPartnerData';

interface BPFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
  onClearFilters: () => void;
}

export const BPFilters: React.FC<BPFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const { data: groups } = useBPGroups();

  const bpTypeOptions: ('Customer' | 'Vendor' | 'Lead' | 'Employee')[] = [
    'Customer',
    'Vendor',
    'Lead',
    'Employee'
  ];

  const statusOptions: ('Active' | 'Inactive')[] = ['Active', 'Inactive'];

  const handleBPTypeToggle = (type: 'Customer' | 'Vendor' | 'Lead' | 'Employee') => {
    const currentTypes = filters.bpType || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    onFiltersChange({
      ...filters,
      bpType: newTypes.length > 0 ? newTypes : undefined
    });
  };

  const handleStatusToggle = (status: 'Active' | 'Inactive') => {
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

  const getBPTypeColor = (type: string) => {
    const colors = {
      'Customer': 'bg-blue-100 text-blue-800',
      'Vendor': 'bg-green-100 text-green-800',
      'Lead': 'bg-yellow-100 text-yellow-800',
      'Employee': 'bg-purple-100 text-purple-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search and Group Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or code..."
                value={filters.search || ''}
                onChange={(e) => onFiltersChange({ ...filters, search: e.target.value || undefined })}
                className="pl-10"
              />
            </div>
            
            <Select
              value={filters.group || ''}
              onValueChange={(value) => onFiltersChange({ ...filters, group: value || undefined })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All groups" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All groups</SelectItem>
                {groups?.map((group) => (
                  <SelectItem key={group.id} value={group.name}>
                    {group.name} ({group.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* BP Type Filters */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Business Partner Type
            </label>
            <div className="flex flex-wrap gap-2">
              {bpTypeOptions.map((type) => {
                const isSelected = filters.bpType?.includes(type);
                return (
                  <Badge
                    key={type}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : `hover:bg-gray-100 ${getBPTypeColor(type)}`
                    }`}
                    onClick={() => handleBPTypeToggle(type)}
                  >
                    {type}
                    {isSelected && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Status Filters */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Status
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
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : `hover:bg-gray-100 ${getStatusColor(status)}`
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