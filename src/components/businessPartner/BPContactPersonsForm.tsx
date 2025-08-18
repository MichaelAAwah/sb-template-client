import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Plus, Trash2, User } from 'lucide-react';
import { ContactPerson } from '../../types/businessPartner';

interface BPContactPersonsFormProps {
  contactPersons: ContactPerson[];
  onChange: (contactPersons: ContactPerson[]) => void;
}

export const BPContactPersonsForm: React.FC<BPContactPersonsFormProps> = ({
  contactPersons,
  onChange,
}) => {
  const addContactPerson = () => {
    const newContact: ContactPerson = {
      id: `contact-${Date.now()}`,
      firstName: '',
      lastName: '',
      middleName: '',
      title: '',
      position: '',
      address: '',
      gpsAddress: '',
      telephone1: '',
      telephone2: '',
      mobilePhone: '',
      email: '',
      fax: '',
      remarks: '',
    };
    onChange([...contactPersons, newContact]);
  };

  const removeContactPerson = (index: number) => {
    const newContacts = contactPersons.filter((_, i) => i !== index);
    onChange(newContacts);
  };

  const updateContactPerson = (index: number, field: keyof ContactPerson, value: string) => {
    const newContacts = [...contactPersons];
    newContacts[index] = { ...newContacts[index], [field]: value };
    onChange(newContacts);
  };

  const titles = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.', 'Eng.'];

  return (
    <div>
        <div className="flex items-center justify-between mb-4">
          <Button onClick={addContactPerson} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
        {contactPersons.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
            No contact persons added yet. Click "Add Contact" to get started.
          </div>
        ) : (
          <div className="space-y-6">
            {contactPersons.map((contact, index) => (
              <div key={contact.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Contact Person {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeContactPerson(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Title
                    </label>
                    <Select
                      value={contact.title}
                      onValueChange={(value) => updateContactPerson(index, 'title', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {titles.map((title) => (
                          <SelectItem key={title} value={title}>
                            {title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      First Name *
                    </label>
                    <Input
                      value={contact.firstName}
                      onChange={(e) => updateContactPerson(index, 'firstName', e.target.value)}
                      placeholder="First name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Middle Name
                    </label>
                    <Input
                      value={contact.middleName}
                      onChange={(e) => updateContactPerson(index, 'middleName', e.target.value)}
                      placeholder="Middle name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Last Name *
                    </label>
                    <Input
                      value={contact.lastName}
                      onChange={(e) => updateContactPerson(index, 'lastName', e.target.value)}
                      placeholder="Last name"
                    />
                  </div>
                </div>

                {/* Position and Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Position
                    </label>
                    <Input
                      value={contact.position}
                      onChange={(e) => updateContactPerson(index, 'position', e.target.value)}
                      placeholder="e.g., Manager, Director"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      GPS Address
                    </label>
                    <Input
                      value={contact.gpsAddress}
                      onChange={(e) => updateContactPerson(index, 'gpsAddress', e.target.value)}
                      placeholder="e.g., GA-123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Address
                  </label>
                  <Input
                    value={contact.address}
                    onChange={(e) => updateContactPerson(index, 'address', e.target.value)}
                    placeholder="Street address"
                  />
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Telephone 1
                    </label>
                    <Input
                      value={contact.telephone1}
                      onChange={(e) => updateContactPerson(index, 'telephone1', e.target.value)}
                      placeholder="+233-XX-XXX-XXXX"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Telephone 2
                    </label>
                    <Input
                      value={contact.telephone2}
                      onChange={(e) => updateContactPerson(index, 'telephone2', e.target.value)}
                      placeholder="+233-XX-XXX-XXXX"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Mobile Phone *
                    </label>
                    <Input
                      value={contact.mobilePhone}
                      onChange={(e) => updateContactPerson(index, 'mobilePhone', e.target.value)}
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
                      value={contact.email}
                      onChange={(e) => updateContactPerson(index, 'email', e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Fax
                    </label>
                    <Input
                      value={contact.fax}
                      onChange={(e) => updateContactPerson(index, 'fax', e.target.value)}
                      placeholder="+233-XX-XXX-XXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Remarks
                  </label>
                  <Textarea
                    value={contact.remarks}
                    onChange={(e) => updateContactPerson(index, 'remarks', e.target.value)}
                    placeholder="Additional notes about this contact person..."
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};