import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Shield } from 'lucide-react';
import { BusinessPartner } from '../../types/businessPartner';

interface BPCreditControlFormProps {
  data: BusinessPartner['creditControl'];
  onChange: (data: BusinessPartner['creditControl']) => void;
}

export const BPCreditControlForm: React.FC<BPCreditControlFormProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Credit Limit
          </label>
          <Input
            type="number"
            value={data.creditLimit}
            onChange={(e) => onChange({ ...data, creditLimit: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum credit amount allowed for this business partner
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700 block">
              Auto Mobile Money Debit
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Automatically debit mobile money for outstanding invoices
            </p>
          </div>
          <Switch
            checked={data.autoMomoDebit}
            onCheckedChange={(checked) => onChange({ ...data, autoMomoDebit: checked })}
          />
        </div>
    </div>
  );
};