import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CreditCard } from 'lucide-react';
import { BusinessPartner } from '../../types/businessPartner';

interface BPPaymentFormProps {
  data: BusinessPartner['paymentAndBilling'];
  onChange: (data: BusinessPartner['paymentAndBilling']) => void;
}

export const BPPaymentForm: React.FC<BPPaymentFormProps> = ({
  data,
  onChange,
}) => {
  const paymentTermsOptions = [
    'Due on Receipt',
    'Net 15',
    'Net 30',
    'Net 45',
    'Net 60',
    'Net 90',
  ];

  const paymentMethodsOptions = [
    'Cash',
    'Bank Transfer',
    'Mobile Money',
    'Cheque',
    'Credit Card',
  ];

  const banks = [
    'GCB Bank',
    'Ecobank Ghana',
    'Standard Chartered Bank',
    'Fidelity Bank',
    'Zenith Bank',
    'Stanbic Bank',
    'Absa Bank',
    'CAL Bank',
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Payment & Billing</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Payment Terms
            </label>
            <Select
              value={data.paymentTerms}
              onValueChange={(value) => onChange({ ...data, paymentTerms: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment terms..." />
              </SelectTrigger>
              <SelectContent>
                {paymentTermsOptions.map((term) => (
                  <SelectItem key={term} value={term}>
                    {term}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Payment Methods
            </label>
            <Select
              value={data.paymentMethods}
              onValueChange={(value) => onChange({ ...data, paymentMethods: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method..." />
              </SelectTrigger>
              <SelectContent>
                {paymentMethodsOptions.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Bank Name
            </label>
            <Select
              value={data.bankName}
              onValueChange={(value) => onChange({ ...data, bankName: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bank..." />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank} value={bank}>
                    {bank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Branch Name
            </label>
            <Input
              value={data.branchName}
              onChange={(e) => onChange({ ...data, branchName: e.target.value })}
              placeholder="Enter branch name"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};