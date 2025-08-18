import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { DatePicker } from '../ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useCustomers } from '../../hooks/useSalesData';
import { getCurrencySymbol } from '../../api/salesData';

interface SalesOrderHeaderProps {
  formData: {
    customerName: string;
    customerCode: string;
    contactPerson: string;
    postingDate: string;
    documentDate: string;
    requestedDeliveryDate: string;
    shipTo: string;
    billTo: string;
    currency: string;
  };
  onFormDataChange: (data: any) => void;
  onCurrencyChange?: (currency: string) => void;
}

export const SalesOrderHeader: React.FC<SalesOrderHeaderProps> = ({
  formData,
  onFormDataChange,
  onCurrencyChange,
}) => {
  const { data: customers } = useCustomers();

  const handleCustomerChange = (customerId: string) => {
    const customer = customers?.find(c => c.id === customerId);
    if (customer) {
      // Update currency when customer changes
      if (onCurrencyChange && customer.currency !== formData.currency) {
        onCurrencyChange(customer.currency);
      }
      
      onFormDataChange({
        ...formData,
        customerName: customer.name,
        customerCode: customer.code,
        contactPerson: customer.contactPerson,
        shipTo: customer.shipToAddress,
        billTo: customer.billToAddress,
        currency: customer.currency,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Order Details</span>
          {formData.currency && (
            <div className="flex items-center space-x-2 text-sm font-normal">
              <span className="text-gray-600">Currency:</span>
              <span className="font-semibold text-blue-600">
                {formData.currency} ({getCurrencySymbol(formData.currency)})
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customer Details */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Customer *
              </label>
              <Select onValueChange={handleCustomerChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer..." />
                </SelectTrigger>
                <SelectContent>
                  {customers?.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} ({customer.code}) - {customer.currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Customer Code
              </label>
              <Input
                value={formData.customerCode}
                readOnly
                className="bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Contact Person
              </label>
              <Input
                value={formData.contactPerson}
                onChange={(e) => onFormDataChange({ ...formData, contactPerson: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Document Dates */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Document Dates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Posting Date *
              </label>
              <DatePicker
                date={formData.postingDate ? new Date(formData.postingDate) : undefined}
                onDateChange={(date) => 
                  onFormDataChange({ 
                    ...formData, 
                    postingDate: date ? date.toISOString().split('T')[0] : '' 
                  })
                }
                placeholder="Select posting date"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Document Date *
              </label>
              <DatePicker
                date={formData.documentDate ? new Date(formData.documentDate) : undefined}
                onDateChange={(date) => 
                  onFormDataChange({ 
                    ...formData, 
                    documentDate: date ? date.toISOString().split('T')[0] : '' 
                  })
                }
                placeholder="Select document date"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Requested Delivery Date *
              </label>
              <DatePicker
                date={formData.requestedDeliveryDate ? new Date(formData.requestedDeliveryDate) : undefined}
                onDateChange={(date) => 
                  onFormDataChange({ 
                    ...formData, 
                    requestedDeliveryDate: date ? date.toISOString().split('T')[0] : '' 
                  })
                }
                placeholder="Select delivery date"
              />
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Addresses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Ship To Address
              </label>
              <textarea
                value={formData.shipTo}
                onChange={(e) => onFormDataChange({ ...formData, shipTo: e.target.value })}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter shipping address..."
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Bill To Address
              </label>
              <textarea
                value={formData.billTo}
                onChange={(e) => onFormDataChange({ ...formData, billTo: e.target.value })}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter billing address..."
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};