import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus, Trash2, Search } from 'lucide-react';
import { OrderItem } from '../../types/orders';

interface OrderItemsTableProps {
  items: OrderItem[];
  onItemsChange: (items: OrderItem[]) => void;
}

// Mock available items
const AVAILABLE_ITEMS: OrderItem[] = [
  { id: 'item-001', name: 'Rice (50kg bag)', sku: 'RICE-50KG', quantity: 0, unitPrice: 180, totalPrice: 0 },
  { id: 'item-002', name: 'Cooking Oil (5L)', sku: 'OIL-5L', quantity: 0, unitPrice: 45, totalPrice: 0 },
  { id: 'item-003', name: 'Sugar (1kg)', sku: 'SUGAR-1KG', quantity: 0, unitPrice: 8, totalPrice: 0 },
  { id: 'item-004', name: 'Flour (25kg)', sku: 'FLOUR-25KG', quantity: 0, unitPrice: 120, totalPrice: 0 },
  { id: 'item-005', name: 'Tomato Paste (400g)', sku: 'PASTE-400G', quantity: 0, unitPrice: 3.5, totalPrice: 0 },
  { id: 'item-006', name: 'Milk Powder (900g)', sku: 'MILK-900G', quantity: 0, unitPrice: 25, totalPrice: 0 },
  { id: 'item-007', name: 'Soap (200g)', sku: 'SOAP-200G', quantity: 0, unitPrice: 2.5, totalPrice: 0 },
  { id: 'item-008', name: 'Detergent (1kg)', sku: 'DET-1KG', quantity: 0, unitPrice: 12, totalPrice: 0 },
];

export const OrderItemsTable: React.FC<OrderItemsTableProps> = ({ items, onItemsChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAvailableItems = AVAILABLE_ITEMS.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addNewRow = () => {
    const newItem: OrderItem = {
      id: `item-${Date.now()}`,
      name: '',
      sku: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    };
    onItemsChange([...items, newItem]);
  };

  const removeRow = (id: string) => {
    const newItems = items.filter((item) => item.id !== id);
    onItemsChange(newItems);
  };

  const updateItem = (id: string, field: keyof OrderItem, value: any) => {
    const newItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };

        // Recalculate total when quantity or unit price changes
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
        }

        return updatedItem;
      }
      return item;
    });

    onItemsChange(newItems);
  };

  const handleItemSelect = (id: string, selectedItemId: string) => {
    const selectedItem = AVAILABLE_ITEMS.find((item) => item.id === selectedItemId);
    if (selectedItem) {
      const newItems = items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            name: selectedItem.name,
            sku: selectedItem.sku,
            unitPrice: selectedItem.unitPrice,
            totalPrice: item.quantity * selectedItem.unitPrice,
          };
        }
        return item;
      });
      onItemsChange(newItems);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Order Items</CardTitle>
          <Button onClick={addNewRow} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search items by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Quick Add Suggestions */}
          {searchTerm && filteredAvailableItems.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-900 mb-2">Quick Add:</p>
              <div className="flex flex-wrap gap-2">
                {filteredAvailableItems.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      addNewRow();
                      setTimeout(() => {
                        const newId = items[items.length] ? items[items.length].id : `item-${Date.now()}`;
                        handleItemSelect(newId, item.id);
                      }, 0);
                    }}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Items Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="w-24">Quantity</TableHead>
                  <TableHead className="w-28">Unit Price (GHS)</TableHead>
                  <TableHead className="w-28">Total (GHS)</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Select
                        value={item.id}
                        onValueChange={(value) => handleItemSelect(item.id, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={item.name || 'Select item...'} />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_ITEMS.map((availableItem) => (
                            <SelectItem key={availableItem.id} value={availableItem.id}>
                              {availableItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell>
                      <Input
                        value={item.sku}
                        onChange={(e) => updateItem(item.id, 'sku', e.target.value)}
                        className="h-8 text-sm"
                        disabled
                      />
                    </TableCell>

                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="h-8 text-sm"
                        min="1"
                        step="1"
                      />
                    </TableCell>

                    <TableCell>
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="h-8 text-sm"
                        min="0"
                        step="0.01"
                      />
                    </TableCell>

                    <TableCell>
                      <div className="font-semibold text-sm">
                        GHS {item.totalPrice.toFixed(2)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRow(item.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No items added yet. Click "Add Item" to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
