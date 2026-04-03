import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { LoadingSpinner } from '../ui/loading-spinner';
import { ArrowLeft, ShoppingCart, Save, X, RotateCcw } from 'lucide-react';
import { OrderItemsTable } from './OrderItemsTable';
import { OrderPaymentPanel, OrderPaymentData } from './OrderPaymentPanel';
import { OrderItem } from '../../types/orders';

interface OrderFormData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  orderDate: string;
  items: OrderItem[];
  notes: string;
  payment: OrderPaymentData | null;
}

interface OrderCreationPageProps {
  onBack?: () => void;
}

// Mock customers
const CUSTOMERS = [
  { id: 'cust-001', name: 'Akosua Trading Co.', phone: '+233-20-111-2222', address: '12 Market Street, Kumasi' },
  { id: 'cust-002', name: 'Nana Provisions', phone: '+233-24-333-4444', address: '45 Commercial Ave, Accra' },
  { id: 'cust-003', name: 'Yaa Supermarket', phone: '+233-26-555-6666', address: '78 Main Road, Cape Coast' },
  { id: 'cust-004', name: 'Kofi Wholesale', phone: '+233-27-777-8888', address: '90 Trade Center, Tamale' },
  { id: 'cust-005', name: 'Ama General Store', phone: '+233-20-999-0000', address: '23 Shopping Complex, Ho' },
];

export const OrderCreationPage: React.FC<OrderCreationPageProps> = ({ onBack }) => {
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    orderDate: new Date().toISOString().split('T')[0],
    items: [],
    notes: '',
    payment: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleBack = () => {
    onBack?.();
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.125; // 12.5% VAT
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleCustomerSelect = (customerId: string) => {
    const customer = CUSTOMERS.find((c) => c.id === customerId);
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerAddress: customer.address,
      }));
    }
  };

  const handleSave = async (action: 'save' | 'save-close' | 'save-new') => {
    setIsSubmitting(true);

    const { subtotal, tax, total } = calculateTotals();

    const orderData = {
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerAddress: formData.customerAddress,
      orderDate: formData.orderDate,
      items: formData.items,
      subtotal,
      tax,
      total,
      payment: formData.payment,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    };

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);

      console.log('Order created:', orderData);

      switch (action) {
        case 'save-close':
          handleBack();
          break;
        case 'save-new':
          handleClear();
          setSubmitSuccess(false);
          break;
        default:
          setSubmitSuccess(false);
          break;
      }
    }, 1500);
  };

  const handleClear = () => {
    setFormData({
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      orderDate: new Date().toISOString().split('T')[0],
      items: [],
      notes: '',
      payment: null,
    });
  };

  const totals = calculateTotals();
  const isFormValid = formData.customerName && formData.items.length > 0 && formData.payment;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={handleBack} className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create Order</h1>
                  <p className="text-gray-600">Create a new customer order with items and payment details</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">✓ Order created successfully!</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Select Customer
                  </label>
                  <Select onValueChange={handleCustomerSelect} value={formData.customerName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer..." />
                    </SelectTrigger>
                    <SelectContent>
                      {CUSTOMERS.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Customer Name
                    </label>
                    <Input
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="Customer name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Phone Number
                    </label>
                    <Input
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      placeholder="+233 20 123 4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Address
                  </label>
                  <Input
                    value={formData.customerAddress}
                    onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                    placeholder="Customer address"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Order Date
                  </label>
                  <Input
                    type="date"
                    value={formData.orderDate}
                    onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Items Table */}
            <OrderItemsTable
              items={formData.items}
              onItemsChange={(items) => setFormData({ ...formData, items })}
            />

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Order Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add any special instructions or notes for this order..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Footer Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" onClick={handleClear}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                    <Button variant="outline" onClick={handleBack}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleSave('save')}
                      disabled={!isFormValid || isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSave('save-close')}
                      disabled={!isFormValid || isSubmitting}
                    >
                      Save & Close
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSave('save-new')}
                      disabled={!isFormValid || isSubmitting}
                    >
                      Save & New
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">GHS {totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (12.5%):</span>
                    <span className="font-semibold">GHS {totals.tax.toFixed(2)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-base">
                    <span className="font-medium text-gray-900">Total:</span>
                    <span className="font-bold text-blue-600">GHS {totals.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Items Count */}
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">{formData.items.length}</span> item
                    {formData.items.length !== 1 ? 's' : ''} in order
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <OrderPaymentPanel
              payment={formData.payment}
              onPaymentChange={(payment) => setFormData({ ...formData, payment })}
              totalAmount={totals.total}
            />

            {/* Form Validation Info */}
            {!isFormValid && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <p className="text-sm text-yellow-800 font-medium mb-2">Form Incomplete</p>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    {!formData.customerName && <li>• Select a customer</li>}
                    {formData.items.length === 0 && <li>• Add at least one item</li>}
                    {!formData.payment && <li>• Select a payment method</li>}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
