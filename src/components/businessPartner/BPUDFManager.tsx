import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { DatePicker } from '../ui/date-picker';
import { Badge } from '../ui/badge';
import { 
  Settings, 
  Type, 
  Hash, 
  ToggleLeft, 
  Calendar,
  Plus,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { UserDefinedField } from '../../types/businessPartner';
import { useBPUDFs, useUpdateBPUDFs } from '../../hooks/useBusinessPartnerData';
import { LoadingSpinner } from '../ui/loading-spinner';

interface BPUDFManagerProps {
  bpId: string;
  readOnly?: boolean;
}

interface UDFFormData {
  category: 'Text Information' | 'Numeric Information' | 'Yes/No Information' | 'Date Information';
  name: string;
  type: 'text' | 'numeric' | 'boolean' | 'date';
  value: string | number | boolean | Date;
  description?: string;
}

export const BPUDFManager: React.FC<BPUDFManagerProps> = ({
  bpId,
  readOnly = false,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<UDFFormData>({
    category: 'Text Information',
    name: '',
    type: 'text',
    value: '',
  });

  const { data: udfs, isLoading } = useBPUDFs(bpId);
  const updateUDFsMutation = useUpdateBPUDFs();

  const categories = [
    { 
      key: 'Text Information' as const, 
      icon: Type, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50',
      examples: ['Type of Customer', 'Branches', 'Sales Person']
    },
    { 
      key: 'Numeric Information' as const, 
      icon: Hash, 
      color: 'text-green-600', 
      bgColor: 'bg-green-50',
      examples: ['Discount %', 'Target Sales', 'Credit Score']
    },
    { 
      key: 'Yes/No Information' as const, 
      icon: ToggleLeft, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50',
      examples: ['Discount Applies', 'Send Product Updates', 'VIP Customer']
    },
    { 
      key: 'Date Information' as const, 
      icon: Calendar, 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-50',
      examples: ['Customer Onboarding Date', 'Contract Renewal Date', 'Last Review Date']
    },
  ];

  const handleAddUDF = () => {
    setIsAdding(true);
    setFormData({
      category: 'Text Information',
      name: '',
      type: 'text',
      value: '',
    });
  };

  const handleSaveUDF = async () => {
    if (!formData.name.trim()) return;

    const newUDF: UserDefinedField = {
      id: `udf-${Date.now()}`,
      category: formData.category,
      name: formData.name,
      type: formData.type,
      value: formData.value,
      description: formData.description,
    };

    try {
      const updatedUDFs = [...(udfs || []), newUDF];
      await updateUDFsMutation.mutateAsync({ bpId, udfs: updatedUDFs });
      setIsAdding(false);
      setFormData({
        category: 'Text Information',
        name: '',
        type: 'text',
        value: '',
      });
    } catch (error) {
      console.error('Failed to save UDF:', error);
    }
  };

  const handleUpdateUDF = async (udfId: string, updates: Partial<UserDefinedField>) => {
    if (!udfs) return;

    try {
      const updatedUDFs = udfs.map(udf => 
        udf.id === udfId ? { ...udf, ...updates } : udf
      );
      await updateUDFsMutation.mutateAsync({ bpId, udfs: updatedUDFs });
    } catch (error) {
      console.error('Failed to update UDF:', error);
    }
  };

  const handleDeleteUDF = async (udfId: string) => {
    if (!udfs || !window.confirm('Are you sure you want to delete this field?')) return;

    try {
      const updatedUDFs = udfs.filter(udf => udf.id !== udfId);
      await updateUDFsMutation.mutateAsync({ bpId, udfs: updatedUDFs });
    } catch (error) {
      console.error('Failed to delete UDF:', error);
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setFormData({
      category: 'Text Information',
      name: '',
      type: 'text',
      value: '',
    });
  };

  const renderUDFValue = (udf: UserDefinedField) => {
    switch (udf.type) {
      case 'boolean':
        return (
          <Switch
            checked={Boolean(udf.value)}
            onCheckedChange={(checked) => !readOnly && handleUpdateUDF(udf.id, { value: checked })}
            disabled={readOnly}
          />
        );
      case 'date':
        return (
          <DatePicker
            date={udf.value ? new Date(udf.value as string) : undefined}
            onDateChange={(date) => !readOnly && handleUpdateUDF(udf.id, { value: date || '' })}
            disabled={readOnly}
            placeholder="Select date"
          />
        );
      case 'numeric':
        return (
          <Input
            type="number"
            value={udf.value as number}
            onChange={(e) => !readOnly && handleUpdateUDF(udf.id, { value: parseFloat(e.target.value) || 0 })}
            readOnly={readOnly}
            className={readOnly ? 'bg-gray-50' : ''}
          />
        );
      default:
        return (
          <Input
            value={udf.value as string}
            onChange={(e) => !readOnly && handleUpdateUDF(udf.id, { value: e.target.value })}
            readOnly={readOnly}
            className={readOnly ? 'bg-gray-50' : ''}
          />
        );
    }
  };

  const groupedUDFs = categories.map(category => ({
    ...category,
    fields: udfs?.filter(udf => udf.category === category.key) || []
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>User Defined Fields</span>
          </CardTitle>
          {!readOnly && (
            <Button 
              onClick={handleAddUDF} 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isAdding}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Add UDF Form */}
            {isAdding && (
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <h4 className="font-medium text-gray-900 mb-4">Add New Field</h4>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          const category = e.target.value as any;
                          const type = category === 'Text Information' ? 'text' :
                                     category === 'Numeric Information' ? 'numeric' :
                                     category === 'Yes/No Information' ? 'boolean' : 'date';
                          setFormData({ ...formData, category, type, value: type === 'boolean' ? false : type === 'numeric' ? 0 : '' });
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {categories.map((cat) => (
                          <option key={cat.key} value={cat.key}>
                            {cat.key}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Field Name *
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter field name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Description
                    </label>
                    <Input
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Optional field description"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Initial Value
                    </label>
                    {formData.type === 'boolean' ? (
                      <Switch
                        checked={Boolean(formData.value)}
                        onCheckedChange={(checked) => setFormData({ ...formData, value: checked })}
                      />
                    ) : formData.type === 'date' ? (
                      <DatePicker
                        date={formData.value ? new Date(formData.value as string) : undefined}
                        onDateChange={(date) => setFormData({ ...formData, value: date || '' })}
                        placeholder="Select date"
                      />
                    ) : formData.type === 'numeric' ? (
                      <Input
                        type="number"
                        value={formData.value as number}
                        onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                        placeholder="0"
                      />
                    ) : (
                      <Input
                        value={formData.value as string}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        placeholder="Enter value"
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelAdd}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveUDF}
                      size="sm"
                      disabled={!formData.name.trim() || updateUDFsMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {updateUDFsMutation.isPending ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Field
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* UDF Categories */}
            {groupedUDFs.map((category) => {
              const Icon = category.icon;
              
              return (
                <div key={category.key}>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className={`p-2 rounded-lg ${category.bgColor}`}>
                      <Icon className={`h-4 w-4 ${category.color}`} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{category.key}</h3>
                    <Badge variant="outline" className="text-xs">
                      {category.fields.length} fields
                    </Badge>
                  </div>

                  {category.fields.length === 0 ? (
                    <div className="p-4 border border-dashed rounded-lg text-center text-gray-500">
                      <p className="text-sm">No {category.key.toLowerCase()} fields defined</p>
                      {!readOnly && (
                        <p className="text-xs mt-1">
                          Examples: {category.examples.join(', ')}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {category.fields.map((udf) => (
                        <div
                          key={udf.id}
                          className="p-4 border border-gray-200 rounded-lg bg-white"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-3">
                              <div>
                                <label className="text-sm font-medium text-gray-700 block">
                                  {udf.name}
                                </label>
                                {udf.description && (
                                  <p className="text-xs text-gray-500 mt-1">{udf.description}</p>
                                )}
                              </div>
                              
                              <div className="max-w-xs">
                                {renderUDFValue(udf)}
                              </div>
                            </div>

                            {!readOnly && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUDF(udf.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                disabled={updateUDFsMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {udfs && udfs.length === 0 && !isAdding && (
              <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
                <Settings className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p>No user defined fields configured yet.</p>
                {!readOnly && (
                  <p className="text-sm">Click "Add Field" to create custom fields for this business partner.</p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};