import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Trash2, MapPin } from 'lucide-react';
import { Address } from '../../types/businessPartner';

interface BPAddressesFormProps {
  addresses: Address[];
  onChange: (addresses: Address[]) => void;
}

export const BPAddressesForm: React.FC<BPAddressesFormProps> = ({
  addresses,
  onChange,
}) => {
  const addAddress = () => {
    const newAddress: Address = {
      id: `address-${Date.now()}`,
      addressType: 'Bill To',
      addressName2: '',
      addressName3: '',
      poBox: '',
      streetNo: '',
      block: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Ghana',
      gpsAddress: '',
    };
    onChange([...addresses, newAddress]);
  };

  const removeAddress = (index: number) => {
    const newAddresses = addresses.filter((_, i) => i !== index);
    onChange(newAddresses);
  };

  const updateAddress = (index: number, field: keyof Address, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[index] = { ...newAddresses[index], [field]: value };
    onChange(newAddresses);
  };

  const ghanaStates = [
    'Greater Accra', 'Ashanti', 'Northern', 'Central', 'Volta', 
    'Eastern', 'Western', 'Upper East', 'Upper West', 'Brong-Ahafo'
  ];

  return (
    <div>
        <div className="flex items-center justify-between mb-4">
          <Button onClick={addAddress} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>
        {addresses.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
            No addresses added yet. Click "Add Address" to get started.
          </div>
        ) : (
          <div className="space-y-6">
            {addresses.map((address, index) => (
              <div key={address.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Address {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAddress(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Address Type and Names */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Address Type *
                    </label>
                    <Select
                      value={address.addressType}
                      onValueChange={(value: 'Bill To' | 'Ship To') => updateAddress(index, 'addressType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bill To">Bill To</SelectItem>
                        <SelectItem value="Ship To">Ship To</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Address Name 2
                    </label>
                    <Input
                      value={address.addressName2}
                      onChange={(e) => updateAddress(index, 'addressName2', e.target.value)}
                      placeholder="Additional address line"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Address Name 3
                    </label>
                    <Input
                      value={address.addressName3}
                      onChange={(e) => updateAddress(index, 'addressName3', e.target.value)}
                      placeholder="Additional address line"
                    />
                  </div>
                </div>

                {/* Street Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Street No. *
                    </label>
                    <Input
                      value={address.streetNo}
                      onChange={(e) => updateAddress(index, 'streetNo', e.target.value)}
                      placeholder="Street number"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Block
                    </label>
                    <Input
                      value={address.block}
                      onChange={(e) => updateAddress(index, 'block', e.target.value)}
                      placeholder="Block"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      P.O. Box
                    </label>
                    <Input
                      value={address.poBox}
                      onChange={(e) => updateAddress(index, 'poBox', e.target.value)}
                      placeholder="P.O. Box number"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      GPS Address
                    </label>
                    <Input
                      value={address.gpsAddress}
                      onChange={(e) => updateAddress(index, 'gpsAddress', e.target.value)}
                      placeholder="e.g., GA-123-4567"
                    />
                  </div>
                </div>

                {/* Location Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      City *
                    </label>
                    <Input
                      value={address.city}
                      onChange={(e) => updateAddress(index, 'city', e.target.value)}
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      State/Region *
                    </label>
                    <Select
                      value={address.state}
                      onValueChange={(value) => updateAddress(index, 'state', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ghanaStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Zip Code
                    </label>
                    <Input
                      value={address.zipCode}
                      onChange={(e) => updateAddress(index, 'zipCode', e.target.value)}
                      placeholder="Zip code"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Country *
                    </label>
                    <Input
                      value={address.country}
                      onChange={(e) => updateAddress(index, 'country', e.target.value)}
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};