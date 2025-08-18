import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DatePicker } from '../ui/date-picker';
import { Plus, Trash2, CreditCard, Banknote, DollarSign } from 'lucide-react';
import { PaymentMeans, ChequePayment } from '../../types/sales';
import { getCurrencySymbol } from '../../api/salesData';

interface PaymentMeansPanelProps {
  paymentMeans: PaymentMeans | undefined;
  onPaymentMeansChange: (paymentMeans: PaymentMeans) => void;
  totalAmount: number;
  currency: string;
}

export const PaymentMeansPanel: React.FC<PaymentMeansPanelProps> = ({
  paymentMeans,
  onPaymentMeansChange,
  totalAmount,
  currency,
}) => {
  const currencySymbol = getCurrencySymbol(currency);

  const handleMethodChange = (method: 'cheque' | 'bank-transfer' | 'cash') => {
    const newPaymentMeans: PaymentMeans = {
      method,
      bankCharge: paymentMeans?.bankCharge || 0,
    };

    switch (method) {
      case 'cheque':
        newPaymentMeans.cheques = [];
        break;
      case 'bank-transfer':
        newPaymentMeans.bankTransfer = {
          amountReceived: totalAmount,
          transferDate: new Date().toISOString().split('T')[0],
          reference: '',
        };
        break;
      case 'cash':
        newPaymentMeans.cash = {
          amountReceived: totalAmount,
        };
        break;
    }

    onPaymentMeansChange(newPaymentMeans);
  };

  const addCheque = () => {
    if (!paymentMeans || paymentMeans.method !== 'cheque') return;

    const newCheque: ChequePayment = {
      id: `cheque-${Date.now()}`,
      chequeNo: '',
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      bankName: '',
      branch: '',
      accountNo: '',
    };

    const updatedPaymentMeans = {
      ...paymentMeans,
      cheques: [...(paymentMeans.cheques || []), newCheque],
    };

    onPaymentMeansChange(updatedPaymentMeans);
  };

  const removeCheque = (chequeId: string) => {
    if (!paymentMeans || paymentMeans.method !== 'cheque') return;

    const updatedPaymentMeans = {
      ...paymentMeans,
      cheques: paymentMeans.cheques?.filter(c => c.id !== chequeId) || [],
    };

    onPaymentMeansChange(updatedPaymentMeans);
  };

  const updateCheque = (chequeId: string, field: keyof ChequePayment, value: any) => {
    if (!paymentMeans || paymentMeans.method !== 'cheque') return;

    const updatedPaymentMeans = {
      ...paymentMeans,
      cheques: paymentMeans.cheques?.map(cheque =>
        cheque.id === chequeId ? { ...cheque, [field]: value } : cheque
      ) || [],
    };

    onPaymentMeansChange(updatedPaymentMeans);
  };

  const updateBankTransfer = (field: keyof NonNullable<PaymentMeans['bankTransfer']>, value: any) => {
    if (!paymentMeans || paymentMeans.method !== 'bank-transfer') return;

    const updatedPaymentMeans = {
      ...paymentMeans,
      bankTransfer: {
        ...paymentMeans.bankTransfer!,
        [field]: value,
      },
    };

    onPaymentMeansChange(updatedPaymentMeans);
  };

  const updateCash = (field: keyof NonNullable<PaymentMeans['cash']>, value: any) => {
    if (!paymentMeans || paymentMeans.method !== 'cash') return;

    const updatedPaymentMeans = {
      ...paymentMeans,
      cash: {
        ...paymentMeans.cash!,
        [field]: value,
      },
    };

    onPaymentMeansChange(updatedPaymentMeans);
  };

  const updateBankCharge = (value: number) => {
    if (!paymentMeans) return;

    const updatedPaymentMeans = {
      ...paymentMeans,
      bankCharge: value,
    };

    onPaymentMeansChange(updatedPaymentMeans);
  };

  const calculatePaidAmount = (): number => {
    if (!paymentMeans) return 0;

    switch (paymentMeans.method) {
      case 'cheque':
        return paymentMeans.cheques?.reduce((sum, cheque) => sum + cheque.amount, 0) || 0;
      case 'bank-transfer':
        return paymentMeans.bankTransfer?.amountReceived || 0;
      case 'cash':
        return paymentMeans.cash?.amountReceived || 0;
      default:
        return 0;
    }
  };

  const paidAmount = calculatePaidAmount();
  const bankCharge = paymentMeans?.bankCharge || 0;
  const balanceDue = totalAmount - paidAmount + bankCharge;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Payment Means</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Payment Method
          </label>
          <Select
            value={paymentMeans?.method || ''}
            onValueChange={handleMethodChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment method..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cheque">
                <div className="flex items-center space-x-2">
                  <Banknote className="h-4 w-4" />
                  <span>Cheque</span>
                </div>
              </SelectItem>
              <SelectItem value="bank-transfer">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Bank Transfer</span>
                </div>
              </SelectItem>
              <SelectItem value="cash">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Cash</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cheque Payment Details */}
        {paymentMeans?.method === 'cheque' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Cheque Details</h3>
              <Button onClick={addCheque} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Cheque
              </Button>
            </div>

            {paymentMeans.cheques && paymentMeans.cheques.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cheque No.</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Bank Name</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Account No.</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentMeans.cheques.map((cheque) => (
                      <TableRow key={cheque.id}>
                        <TableCell>
                          <Input
                            value={cheque.chequeNo}
                            onChange={(e) => updateCheque(cheque.id, 'chequeNo', e.target.value)}
                            className="h-8"
                            placeholder="Cheque number"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={cheque.amount}
                            onChange={(e) => updateCheque(cheque.id, 'amount', parseFloat(e.target.value) || 0)}
                            className="h-8"
                            min="0"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell>
                          <DatePicker
                            date={cheque.dueDate ? new Date(cheque.dueDate) : undefined}
                            onDateChange={(date) => 
                              updateCheque(cheque.id, 'dueDate', date ? date.toISOString().split('T')[0] : '')
                            }
                            placeholder="Due date"
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={cheque.bankName}
                            onChange={(e) => updateCheque(cheque.id, 'bankName', e.target.value)}
                            className="h-8"
                            placeholder="Bank name"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={cheque.branch}
                            onChange={(e) => updateCheque(cheque.id, 'branch', e.target.value)}
                            className="h-8"
                            placeholder="Branch"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={cheque.accountNo}
                            onChange={(e) => updateCheque(cheque.id, 'accountNo', e.target.value)}
                            className="h-8"
                            placeholder="Account no."
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCheque(cheque.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
                No cheques added yet. Click "Add Cheque" to get started.
              </div>
            )}
          </div>
        )}

        {/* Bank Transfer Payment Details */}
        {paymentMeans?.method === 'bank-transfer' && paymentMeans.bankTransfer && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Bank Transfer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Amount Received
                </label>
                <Input
                  type="number"
                  value={paymentMeans.bankTransfer.amountReceived}
                  onChange={(e) => updateBankTransfer('amountReceived', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Transfer Date
                </label>
                <DatePicker
                  date={paymentMeans.bankTransfer.transferDate ? new Date(paymentMeans.bankTransfer.transferDate) : undefined}
                  onDateChange={(date) => 
                    updateBankTransfer('transferDate', date ? date.toISOString().split('T')[0] : '')
                  }
                  placeholder="Transfer date"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Reference
                </label>
                <Input
                  value={paymentMeans.bankTransfer.reference}
                  onChange={(e) => updateBankTransfer('reference', e.target.value)}
                  placeholder="Transfer reference"
                />
              </div>
            </div>
          </div>
        )}

        {/* Cash Payment Details */}
        {paymentMeans?.method === 'cash' && paymentMeans.cash && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Cash Payment Details</h3>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Amount Received
              </label>
              <Input
                type="number"
                value={paymentMeans.cash.amountReceived}
                onChange={(e) => updateCash('amountReceived', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                className="max-w-xs"
              />
            </div>
          </div>
        )}

        {/* Bank Charge */}
        {paymentMeans && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Bank Charge (Optional)
            </label>
            <Input
              type="number"
              value={bankCharge}
              onChange={(e) => updateBankCharge(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
              className="max-w-xs"
            />
          </div>
        )}

        {/* Payment Summary */}
        {paymentMeans && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Overall Amount:</span>
                <span className="font-semibold">{currencySymbol}{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Paid:</span>
                <span className="font-semibold text-green-600">{currencySymbol}{paidAmount.toFixed(2)}</span>
              </div>
              {bankCharge > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank Charge:</span>
                  <span className="font-semibold text-orange-600">{currencySymbol}{bankCharge.toFixed(2)}</span>
                </div>
              )}
              <hr className="border-gray-300" />
              <div className="flex justify-between">
                <span className="font-medium text-gray-900">Balance Due:</span>
                <span className={`font-bold ${balanceDue === 0 ? 'text-green-600' : balanceDue > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                  {currencySymbol}{balanceDue.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Validation Messages */}
            {paymentMeans.method === 'cheque' && paidAmount !== totalAmount && (
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                ⚠️ Total cheque amounts must equal the order total ({currencySymbol}{totalAmount.toFixed(2)})
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};