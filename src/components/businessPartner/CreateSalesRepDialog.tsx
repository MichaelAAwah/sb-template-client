import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { LoadingSpinner } from '../ui/loading-spinner';
import { UserPlus } from 'lucide-react';
import { SalesRep } from '../../types/businessPartner';
import { useCreateSalesRep } from '../../hooks/useBusinessPartnerData';

interface CreateSalesRepDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSalesRepCreated: (salesRep: SalesRep) => void;
}

export const CreateSalesRepDialog: React.FC<CreateSalesRepDialogProps> = ({
  open,
  onOpenChange,
  onSalesRepCreated,
}) => {
  const createSalesRepMutation = useCreateSalesRep();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
  });

  const handleCreate = async () => {
    try {
      const newSalesRep = await createSalesRepMutation.mutateAsync(formData);
      onSalesRepCreated(newSalesRep);
      onOpenChange(false);
      setFormData({ firstName: '', lastName: '', email: '', mobile: '' });
    } catch (error) {
      console.error('Failed to create sales rep:', error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setFormData({ firstName: '', lastName: '', email: '', mobile: '' });
  };

  const isValid = formData.firstName && formData.lastName && formData.email && formData.mobile;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Create Sales Representative</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                First Name *
              </label>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="First name"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Last Name *
              </label>
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@company.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Mobile *
            </label>
            <Input
              value={formData.mobile}
              onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
              placeholder="+233-XX-XXX-XXXX"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!isValid || createSalesRepMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {createSalesRepMutation.isPending ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Creating...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Create Sales Rep
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};