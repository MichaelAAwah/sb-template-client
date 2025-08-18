import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { BusinessPartner } from '../../types/businessPartner';

interface BPGeneralFormProps {
  data: BusinessPartner['general'];
  onChange: (data: BusinessPartner['general']) => void;
}

export const BPGeneralForm: React.FC<BPGeneralFormProps> = ({
  data,
  onChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Telephone 1
            </label>
            <Input
              value={data.telephone1}
              onChange={(e) => onChange({ ...data, telephone1: e.target.value })}
              placeholder="+233-XX-XXX-XXXX"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Telephone 2
            </label>
            <Input
              value={data.telephone2}
              onChange={(e) => onChange({ ...data, telephone2: e.target.value })}
              placeholder="+233-XX-XXX-XXXX"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Mobile Phone *
            </label>
            <Input
              value={data.mobilePhone}
              onChange={(e) => onChange({ ...data, mobilePhone: e.target.value })}
              placeholder="+233-XX-XXX-XXXX"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Email *
            </label>
            <Input
              type="email"
              value={data.email}
              onChange={(e) => onChange({ ...data, email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Website
            </label>
            <Input
              value={data.website}
              onChange={(e) => onChange({ ...data, website: e.target.value })}
              placeholder="www.example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Industry
            </label>
            <Input
              value={data.industry}
              onChange={(e) => onChange({ ...data, industry: e.target.value })}
              placeholder="e.g., Retail, Manufacturing"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Fax
            </label>
            <Input
              value={data.fax}
              onChange={(e) => onChange({ ...data, fax: e.target.value })}
              placeholder="+233-XX-XXX-XXXX"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};