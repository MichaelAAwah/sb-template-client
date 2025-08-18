import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Calculator } from 'lucide-react';
import { getCurrencySymbol } from '../../api/salesData';

interface SalesOrderSummaryProps {
  subtotal: number;
  discountType: 'percentage' | 'amount';
  discountValue: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  currency: string;
  onDiscountChange: (type: 'percentage' | 'amount', value: number) => void;
}

export const SalesOrderSummary: React.FC<SalesOrderSummaryProps> = ({
  subtotal,
  discountType,
  discountValue,
  discountAmount,
  taxAmount,
  total,
  currency,
  onDiscountChange,
}) => {
  const currencySymbol = getCurrencySymbol(currency);

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5" />
          <span>Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Subtotal:</span>
          <span className="font-semibold">{currencySymbol}{subtotal.toFixed(2)}</span>
        </div>

        {/* Discount */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Discount:</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">%</span>
              <Switch
                checked={discountType === 'amount'}
                onCheckedChange={(checked) => 
                  onDiscountChange(checked ? 'amount' : 'percentage', discountValue)
                }
              />
              <span className="text-xs text-gray-500">{currencySymbol}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={discountValue}
              onChange={(e) => onDiscountChange(discountType, parseFloat(e.target.value) || 0)}
              className="h-8"
              min="0"
              step={discountType === 'percentage' ? '0.1' : '0.01'}
            />
            <span className="text-sm text-gray-500 min-w-[20px]">
              {discountType === 'percentage' ? '%' : currencySymbol}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Discount Amount:</span>
            <span className="text-red-600">-{currencySymbol}{discountAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Tax */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Tax:</span>
          <span className="font-semibold">{currencySymbol}{taxAmount.toFixed(2)}</span>
        </div>

        {/* Divider */}
        <hr className="border-gray-200" />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Total:</span>
          <span className="text-xl font-bold text-green-600">{currencySymbol}{total.toFixed(2)}</span>
        </div>

        {/* Breakdown */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Calculation:</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{currencySymbol}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Less Discount:</span>
              <span>-{currencySymbol}{discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Plus Tax:</span>
              <span>+{currencySymbol}{taxAmount.toFixed(2)}</span>
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>{currencySymbol}{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};