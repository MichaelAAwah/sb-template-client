import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { LoadingSpinner } from '../ui/loading-spinner';
import { ArrowLeft, Users, Save, X, RotateCcw, Plus } from 'lucide-react';
import { BPMasterDataForm } from './BPMasterDataForm';
import { BPGeneralForm } from './BPGeneralForm';
import { BPContactPersonsForm } from './BPContactPersonsForm';
import { BPAddressesForm } from './BPAddressesForm';
import { BPAccountingForm } from './BPAccountingForm';
import { BPPaymentForm } from './BPPaymentForm';
import { BPCreditControlForm } from './BPCreditControlForm';
import { BPDefaultSettingsForm } from './BPDefaultSettingsForm';
import { CreateSalesRepDialog } from './CreateSalesRepDialog';
import { BusinessPartner, ContactPerson, Address, SalesRep } from '../../types/businessPartner';
import { useCreateBusinessPartner } from '../../hooks/useBusinessPartnerData';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

interface BPFormData {
  masterData: BusinessPartner['masterData'];
  general: BusinessPartner['general'];
  contactPersons: ContactPerson[];
  addresses: Address[];
  accounting: BusinessPartner['accounting'];
  paymentAndBilling: BusinessPartner['paymentAndBilling'];
  creditControl: BusinessPartner['creditControl'];
  defaultSettings: BusinessPartner['defaultSettings'];
  salesRep?: SalesRep;
}

const BPCreationContent: React.FC = () => {
  const createBPMutation = useCreateBusinessPartner();
  const [showCreateSalesRep, setShowCreateSalesRep] = useState(false);
  
  const [formData, setFormData] = useState<BPFormData>({
    masterData: {
      bpType: 'Customer',
      name: '',
      displayName: '',
      bpGroup: '',
      currency: 'GHS',
      tinNo: '',
    },
    general: {
      telephone1: '',
      telephone2: '',
      mobilePhone: '',
      email: '',
      industry: '',
      fax: '',
      website: '',
    },
    contactPersons: [],
    addresses: [],
    accounting: {
      controlAccountId: '',
      controlAccounts: '',
      openingBalance: 0,
      openingBalanceDate: new Date().toISOString().split('T')[0],
    },
    paymentAndBilling: {
      paymentTerms: '',
      paymentMethods: '',
      bankName: '',
      branchName: '',
    },
    creditControl: {
      creditLimit: 0,
      autoMomoDebit: false,
    },
    defaultSettings: {
      statementDistribution: 'None',
      frequency: 'End of Month',
      defaultDiscount: 0,
      defaultPriceList: '',
    },
  });

  const handleBack = () => {
    console.log('Navigate back to BP list');
  };

  const handleSave = async (action: 'save' | 'save-close' | 'save-new') => {
    const bpData: Omit<BusinessPartner, 'id' | 'createdAt' | 'updatedAt'> = {
      ...formData,
      status: 'Active',
      balance: formData.accounting.openingBalance,
    };

    try {
      await createBPMutation.mutateAsync(bpData);
      
      switch (action) {
        case 'save-close':
          console.log('Save and navigate back to list');
          break;
        case 'save-new':
          handleClear();
          break;
        default:
          console.log('Business partner saved');
      }
    } catch (error) {
      console.error('Failed to save business partner:', error);
    }
  };

  const handleClear = () => {
    setFormData({
      masterData: {
        bpType: 'Customer',
        name: '',
        displayName: '',
        bpGroup: '',
        currency: 'GHS',
        tinNo: '',
      },
      general: {
        telephone1: '',
        telephone2: '',
        mobilePhone: '',
        email: '',
        industry: '',
        fax: '',
        website: '',
      },
      contactPersons: [],
      addresses: [],
      accounting: {
        controlAccountId: '',
        controlAccounts: '',
        openingBalance: 0,
        openingBalanceDate: new Date().toISOString().split('T')[0],
      },
      paymentAndBilling: {
        paymentTerms: '',
        paymentMethods: '',
        bankName: '',
        branchName: '',
      },
      creditControl: {
        creditLimit: 0,
        autoMomoDebit: false,
      },
      defaultSettings: {
        statementDistribution: 'None',
        frequency: 'End of Month',
        defaultDiscount: 0,
        defaultPriceList: '',
      },
    });
  };

  const handleSalesRepCreated = (salesRep: SalesRep) => {
    setFormData(prev => ({ ...prev, salesRep }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={handleBack} className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create Business Partner</h1>
                  <p className="text-gray-600">Add a new customer, vendor, or business partner</p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowCreateSalesRep(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Sales Rep</span>
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Master Data */}
          <BPMasterDataForm
            data={formData.masterData}
            onChange={(data) => setFormData(prev => ({ ...prev, masterData: data }))}
          />

          {/* General Information */}
          <BPGeneralForm
            data={formData.general}
            onChange={(data) => setFormData(prev => ({ ...prev, general: data }))}
          />

          {/* Contact Persons */}
          <BPContactPersonsForm
            contactPersons={formData.contactPersons}
            onChange={(contactPersons) => setFormData(prev => ({ ...prev, contactPersons }))}
          />

          {/* Addresses */}
          <BPAddressesForm
            addresses={formData.addresses}
            onChange={(addresses) => setFormData(prev => ({ ...prev, addresses }))}
          />

          {/* Accounting */}
          <BPAccountingForm
            data={formData.accounting}
            onChange={(data) => setFormData(prev => ({ ...prev, accounting: data }))}
          />

          {/* Payment and Billing */}
          <BPPaymentForm
            data={formData.paymentAndBilling}
            onChange={(data) => setFormData(prev => ({ ...prev, paymentAndBilling: data }))}
          />

          {/* Credit Control */}
          <BPCreditControlForm
            data={formData.creditControl}
            onChange={(data) => setFormData(prev => ({ ...prev, creditControl: data }))}
          />

          {/* Default Settings */}
          <BPDefaultSettingsForm
            data={formData.defaultSettings}
            salesRep={formData.salesRep}
            onChange={(data) => setFormData(prev => ({ ...prev, defaultSettings: data }))}
            onSalesRepChange={(salesRep) => setFormData(prev => ({ ...prev, salesRep }))}
          />

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
                    disabled={createBPMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {createBPMutation.isPending ? (
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
                    disabled={createBPMutation.isPending}
                  >
                    Save & Close
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSave('save-new')}
                    disabled={createBPMutation.isPending}
                  >
                    Save & New
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Sales Rep Dialog */}
        <CreateSalesRepDialog
          open={showCreateSalesRep}
          onOpenChange={setShowCreateSalesRep}
          onSalesRepCreated={handleSalesRepCreated}
        />
      </div>
    </div>
  );
};

export const BPCreationPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BPCreationContent />
    </QueryClientProvider>
  );
};