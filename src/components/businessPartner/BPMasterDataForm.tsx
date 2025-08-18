import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BusinessPartner } from '../../types/businessPartner';
import { useBPGroups } from '../../hooks/useBusinessPartnerData';

interface BPMasterDataFormProps {
  data: BusinessPartner['masterData'];
  onChange: (data: BusinessPartner['masterData']) => void;
}

export const BPMasterDataForm: React.FC<BPMasterDataFormProps> = ({
  data,
  onChange,
}) => {
  const { data: groups } = useBPGroups();

  const currencies = [
    { code: 'GHS', name: 'Ghana Cedi (₵)' },
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'NGN', name: 'Nigerian Naira (₦)' },
    { code: 'CFA', name: 'CFA Franc' },
  ];

  const bpTypes = [
    { value: 'Customer', label: 'Customer' },
    { value: 'Vendor', label: 'Vendor' },
    { value: 'Lead', label: 'Lead' },
    { value: 'Employee', label: 'Employee' },
  ];

  return (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Business Partner Type *
            </label>
            <Select
              value={data.bpType}
              onValueChange={(value: any) => onChange({ ...data, bpType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select BP type..." />
              </SelectTrigger>
              <SelectContent>
                {bpTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Business Partner Group *
            </label>
            <Select
              value={data.bpGroup}
              onValueChange={(value) => onChange({ ...data, bpGroup: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select BP group..." />
              </SelectTrigger>
              <SelectContent>
                {groups?.map((group) => (
                  <SelectItem key={group.id} value={group.name}>
                    {group.name} ({group.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Name *
            </label>
            <Input
              value={data.name}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
              placeholder="Enter business partner name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Display Name
            </label>
            <Input
              value={data.displayName}
              onChange={(e) => onChange({ ...data, displayName: e.target.value })}
              placeholder="Enter display name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Currency *
            </label>
            <Select
              value={data.currency}
              onValueChange={(value: any) => onChange({ ...data, currency: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency..." />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              TIN Number
            </label>
            <Input
              value={data.tinNo}
              onChange={(e) => onChange({ ...data, tinNo: e.target.value })}
              placeholder="Enter TIN number"
            />
          </div>
        </div>
    </div>
  );
};