import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { DatePicker } from '../ui/date-picker';
import { Calculator } from 'lucide-react';
import { BusinessPartner } from '../../types/businessPartner';

interface BPAccountingFormProps {
  data: BusinessPartner['accounting'];
  onChange: (data: BusinessPartner['accounting']) => void;
}

export const BPAccountingForm: React.FC<BPAccountingFormProps> = ({
  data,
  onChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5" />
          <span>Accounting</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Control Account ID
            </label>
            <Input
              value={data.controlAccountId}
              onChange={(e) => onChange({ ...data, controlAccountId: e.target.value })}
              placeholder="e.g., ACC-1001"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Control Accounts
            </label>
            <Input
              value={data.controlAccounts}
              onChange={(e) => onChange({ ...data, controlAccounts: e.target.value })}
              placeholder="e.g., Trade Receivables"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Opening Balance
            </label>
            <Input
              type="number"
              value={data.openingBalance}
              onChange={(e) => onChange({ ...data, openingBalance: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              step="0.01"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Opening Balance Date
            </label>
            <DatePicker
              date={data.openingBalanceDate ? new Date(data.openingBalanceDate) : undefined}
              onDateChange={(date) => 
                onChange({ 
                  ...data, 
                  openingBalanceDate: date ? date.toISOString().split('T')[0] : '' 
                })
              }
              placeholder="Select date"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};