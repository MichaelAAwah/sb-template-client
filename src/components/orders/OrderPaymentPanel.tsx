import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CreditCard, Banknote, DollarSign, Smartphone } from 'lucide-react';

export type PaymentMethod = 'mobile-money' | 'cash' | 'bank-transfer' | 'push-to-pay';

export interface OrderPaymentData {
  method: PaymentMethod;
  amount: number;
  mobileMoneyPhone?: string;
  mobileMoneyNetwork?: 'MTN' | 'Vodafone' | 'AirtelTigo';
  bankTransferRef?: string;
  bankTransferDate?: string;
  pushToPayRef?: string;
}

interface OrderPaymentPanelProps {
  payment: OrderPaymentData | null;
  onPaymentChange: (payment: OrderPaymentData) => void;
  totalAmount: number;
}

export const OrderPaymentPanel: React.FC<OrderPaymentPanelProps> = ({
  payment,
  onPaymentChange,
  totalAmount,
}) => {
  const handleMethodChange = (method: PaymentMethod) => {
    const newPayment: OrderPaymentData = {
      method,
      amount: totalAmount,
    };

    switch (method) {
      case 'mobile-money':
        newPayment.mobileMoneyNetwork = 'MTN';
        newPayment.mobileMoneyPhone = '';
        break;
      case 'bank-transfer':
        newPayment.bankTransferRef = '';
        newPayment.bankTransferDate = new Date().toISOString().split('T')[0];
        break;
      case 'push-to-pay':
        newPayment.pushToPayRef = '';
        break;
      case 'cash':
        // Cash doesn't need additional details
        break;
    }

    onPaymentChange(newPayment);
  };

  const handleFieldChange = (field: string, value: any) => {
    if (!payment) return;
    onPaymentChange({
      ...payment,
      [field]: value,
    });
  };

  const paymentMethods: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { value: 'cash', label: 'Cash', icon: <DollarSign className="h-4 w-4" /> },
    { value: 'mobile-money', label: 'Mobile Money', icon: <Smartphone className="h-4 w-4" /> },
    { value: 'bank-transfer', label: 'Bank Transfer', icon: <CreditCard className="h-4 w-4" /> },
    { value: 'push-to-pay', label: 'Push-to-Pay', icon: <Banknote className="h-4 w-4" /> },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Payment Method</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Select Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.value}
                onClick={() => handleMethodChange(method.value)}
                className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center space-x-2 ${
                  payment?.method === method.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {method.icon}
                <span className="font-medium text-sm">{method.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Money Details */}
        {payment?.method === 'mobile-money' && (
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-gray-900">Mobile Money Details</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Network
                </label>
                <Select
                  value={payment.mobileMoneyNetwork || 'MTN'}
                  onValueChange={(value) => handleFieldChange('mobileMoneyNetwork', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MTN">MTN Mobile Money</SelectItem>
                    <SelectItem value="Vodafone">Vodafone Cash</SelectItem>
                    <SelectItem value="AirtelTigo">AirtelTigo Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="+233 20 123 4567"
                  value={payment.mobileMoneyPhone || ''}
                  onChange={(e) => handleFieldChange('mobileMoneyPhone', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Bank Transfer Details */}
        {payment?.method === 'bank-transfer' && (
          <div className="space-y-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-gray-900">Bank Transfer Details</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Transfer Reference
                </label>
                <Input
                  placeholder="e.g., ORD-001-2024"
                  value={payment.bankTransferRef || ''}
                  onChange={(e) => handleFieldChange('bankTransferRef', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Transfer Date
                </label>
                <Input
                  type="date"
                  value={payment.bankTransferDate || ''}
                  onChange={(e) => handleFieldChange('bankTransferDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Push-to-Pay Details */}
        {payment?.method === 'push-to-pay' && (
          <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-gray-900">Push-to-Pay Details</h4>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Transaction Reference
              </label>
              <Input
                placeholder="e.g., PTM-001-2024"
                value={payment.pushToPayRef || ''}
                onChange={(e) => handleFieldChange('pushToPayRef', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Cash Details */}
        {payment?.method === 'cash' && (
          <div className="space-y-4 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-gray-900">Cash Payment</h4>
            <p className="text-sm text-gray-600">
              Payment will be collected on delivery or at the point of sale.
            </p>
          </div>
        )}

        {/* Payment Summary */}
        {payment && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold">GHS {totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-semibold capitalize">
                  {payment.method.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
