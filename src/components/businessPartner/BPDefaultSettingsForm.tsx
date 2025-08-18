import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Settings, Plus } from 'lucide-react';
import { BusinessPartner, SalesRep } from '../../types/businessPartner';
import { usePriceLists, useSalesReps } from '../../hooks/useBusinessPartnerData';

interface BPDefaultSettingsFormProps {
  data: BusinessPartner['defaultSettings'];
  salesRep?: SalesRep;
  onChange: (data: BusinessPartner['defaultSettings']) => void;
  onSalesRepChange: (salesRep: SalesRep | undefined) => void;
}

export const BPDefaultSettingsForm: React.FC<BPDefaultSettingsFormProps> = ({
  data,
  salesRep,
  onChange,
  onSalesRepChange,
}) => {
  const { data: priceLists } = usePriceLists();
  const { data: salesReps } = useSalesReps();

  const statementDistributionOptions = [
    'None',
    'Print',
    'Email',
    'Email & Print',
  ];

  const frequencyOptions = [
    'Every 15 days',
    'End of Month',
    'End of Quarter',
    'End of Year',
  ];

  return (
    <div className="space-y-6">
        {/* Statement Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Statement Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Statement Distribution
              </label>
              <Select
                value={data.statementDistribution}
                onValueChange={(value: any) => onChange({ ...data, statementDistribution: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select distribution method..." />
                </SelectTrigger>
                <SelectContent>
                  {statementDistributionOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Frequency
              </label>
              <Select
                value={data.frequency}
                onValueChange={(value: any) => onChange({ ...data, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency..." />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Pricing Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Default Discount (%)
              </label>
              <Input
                type="number"
                value={data.defaultDiscount}
                onChange={(e) => onChange({ ...data, defaultDiscount: parseFloat(e.target.value) || 0 })}
                placeholder="0.0"
                step="0.1"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Default Price List
              </label>
              <Select
                value={data.defaultPriceList}
                onValueChange={(value) => onChange({ ...data, defaultPriceList: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select price list..." />
                </SelectTrigger>
                <SelectContent>
                  {priceLists?.map((priceList) => (
                    <SelectItem key={priceList.id} value={priceList.name}>
                      {priceList.name} ({priceList.code}) - {priceList.currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Sales Representative */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Representative</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Select
                value={salesRep?.id || ''}
                onValueChange={(value) => {
                  const selectedRep = salesReps?.find(rep => rep.id === value);
                  onSalesRepChange(selectedRep);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sales representative..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No sales representative</SelectItem>
                  {salesReps?.map((rep) => (
                    <SelectItem key={rep.id} value={rep.id}>
                      {rep.firstName} {rep.lastName} - {rep.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {salesRep && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Name:</span> {salesRep.firstName} {salesRep.lastName}
                </div>
                <div>
                  <span className="font-medium text-blue-800">Email:</span> {salesRep.email}
                </div>
                <div>
                  <span className="font-medium text-blue-800">Mobile:</span> {salesRep.mobile}
                </div>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};