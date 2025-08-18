import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Switch } from '../ui/switch';
import { DatePicker } from '../ui/date-picker';
import { Plus, Trash2, Search } from 'lucide-react';
import { SalesQuotationItem } from '../../types/sales';
import { useItems } from '../../hooks/useSalesData';
import { taxGroups } from '../../api/salesData';

interface SalesQuotationItemsTableProps {
  items: SalesQuotationItem[];
  onItemsChange: (items: SalesQuotationItem[]) => void;
}

export const SalesQuotationItemsTable: React.FC<SalesQuotationItemsTableProps> = ({
  items,
  onItemsChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: availableItems } = useItems(searchTerm);

  const addNewRow = () => {
    const newItem: SalesQuotationItem = {
      id: `item-${Date.now()}`,
      type: 'Item',
      itemNo: '',
      itemName: '',
      itemDescription: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      taxCode: 'V1', // Default to VAT 12.5%
      taxOnly: false,
      uomName: '',
      deliveryDate: new Date().toISOString().split('T')[0],
      location: '',
      project: '',
    };
    onItemsChange([...items, newItem]);
  };

  const removeRow = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onItemsChange(newItems);
  };

  const updateItem = (index: number, field: keyof SalesQuotationItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate total when quantity or unit price changes
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    onItemsChange(newItems);
  };

  const handleItemSelect = (index: number, itemId: string) => {
    const selectedItem = availableItems?.find(item => item.id === itemId);
    if (selectedItem) {
      updateItem(index, 'itemNo', selectedItem.no);
      updateItem(index, 'itemName', selectedItem.name);
      updateItem(index, 'itemDescription', selectedItem.description);
      updateItem(index, 'type', selectedItem.type);
      updateItem(index, 'unitPrice', selectedItem.unitPrice);
      updateItem(index, 'uomName', selectedItem.uomName);
      updateItem(index, 'location', selectedItem.location);
      // Recalculate total
      const newItems = [...items];
      newItems[index].total = newItems[index].quantity * selectedItem.unitPrice;
      onItemsChange(newItems);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Quotation Items</CardTitle>
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
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Items Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    <TableHead className="w-20">Type</TableHead>
                    <TableHead className="w-32">Item No.</TableHead>
                    <TableHead className="w-40">Item Name</TableHead>
                    <TableHead className="w-48">Description</TableHead>
                    <TableHead className="w-24">Qty</TableHead>
                    <TableHead className="w-28">Unit Price</TableHead>
                    <TableHead className="w-28">Total (GHS)</TableHead>
                    <TableHead className="w-32">Tax Code</TableHead>
                    <TableHead className="w-20">Tax Only</TableHead>
                    <TableHead className="w-24">UoM</TableHead>
                    <TableHead className="w-32">Del. Date</TableHead>
                    <TableHead className="w-28">Location</TableHead>
                    <TableHead className="w-28">Project</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Select
                          value={item.type}
                          onValueChange={(value: 'Item' | 'Service' | 'Resource') => 
                            updateItem(index, 'type', value)
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Item">Item</SelectItem>
                            <SelectItem value="Service">Service</SelectItem>
                            <SelectItem value="Resource">Resource</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      
                      <TableCell>
                        <Select
                          value={item.itemNo}
                          onValueChange={(value) => {
                            const selectedItem = availableItems?.find(i => i.no === value);
                            if (selectedItem) {
                              handleItemSelect(index, selectedItem.id);
                            }
                          }}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {availableItems?.map((availableItem) => (
                              <SelectItem key={availableItem.id} value={availableItem.no}>
                                {availableItem.no}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      
                      <TableCell>
                        <Input
                          value={item.itemName}
                          onChange={(e) => updateItem(index, 'itemName', e.target.value)}
                          className="h-8"
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Input
                          value={item.itemDescription}
                          onChange={(e) => updateItem(index, 'itemDescription', e.target.value)}
                          className="h-8"
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="h-8"
                          min="0"
                          step="0.01"
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="h-8"
                          min="0"
                          step="0.01"
                        />
                      </TableCell>
                      
                      <TableCell>
                        <div className="font-semibold">
                          ₵{item.total.toFixed(2)}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Select
                          value={item.taxCode}
                          onValueChange={(value) => updateItem(index, 'taxCode', value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {taxGroups.map((tax) => (
                              <SelectItem key={tax.code} value={tax.code}>
                                {tax.code} - {tax.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      
                      <TableCell>
                        <Switch
                          checked={item.taxOnly}
                          onCheckedChange={(checked) => updateItem(index, 'taxOnly', checked)}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Input
                          value={item.uomName}
                          onChange={(e) => updateItem(index, 'uomName', e.target.value)}
                          className="h-8"
                        />
                      </TableCell>
                      
                      <TableCell>
                        <DatePicker
                          date={item.deliveryDate ? new Date(item.deliveryDate) : undefined}
                          onDateChange={(date) => 
                            updateItem(index, 'deliveryDate', date ? date.toISOString().split('T')[0] : '')
                          }
                          placeholder="Del. date"
                          className="h-8"
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Input
                          value={item.location}
                          onChange={(e) => updateItem(index, 'location', e.target.value)}
                          className="h-8"
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Input
                          value={item.project}
                          onChange={(e) => updateItem(index, 'project', e.target.value)}
                          className="h-8"
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRow(index)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={14} className="text-center py-8 text-gray-500">
                        No items added yet. Click "Add Item" to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};