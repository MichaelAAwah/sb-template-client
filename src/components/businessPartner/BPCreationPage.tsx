import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
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
import { BPNotesManager } from './BPNotesManager';
import { BPUDFManager } from './BPUDFManager';
import { CreateSalesRepDialog } from './CreateSalesRepDialog';
import { BusinessPartner, ContactPerson, Address, SalesRep, BPNote, UserDefinedField } from '../../types/businessPartner';
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

interface BPCreationPageProps {
  onBack?: () => void;
}

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
  notes: BPNote[];
  userDefinedFields: UserDefinedField[];
}

const BPCreationContent: React.FC<BPCreationPageProps> = ({
  onBack,
}) => {
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
    notes: [],
    userDefinedFields: [],
    notes: [],
    userDefinedFields: [],
  });

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
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
          if (onBack) {
            onBack();
          }
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
          <Accordion 
            type="multiple" 
            defaultValue={[
              'master-data', 
              'general', 
              'contact-persons', 
              'addresses', 
              'accounting', 
              'payment-billing', 
              'credit-control', 
              'default-settings',
              'notes',
              'user-defined-fields'
            ]}
            className="space-y-4"
          >
            {/* Master Data */}
            <AccordionItem value="master-data" className="border border-gray-200 rounded-lg">
              <AccordionTrigger className="px-6 hover:no-underline">
                <span className="text-lg font-semibold">Master Data</span>
              </AccordionTrigger>
              <AccordionContent className="px-6">
                <BPMasterDataForm
                  data={formData.masterData}
                  onChange={(data) => setFormData(prev => ({ ...prev, masterData: data }))}
                />
              </AccordionContent>
            </AccordionItem>

            {/* General Information */}
            <AccordionItem value="general" className="border border-gray-200 rounded-lg">
              <AccordionTrigger className="px-6 hover:no-underline">
                <span className="text-lg font-semibold">General Information</span>
              </AccordionTrigger>
              <AccordionContent className="px-6">
                <BPGeneralForm
                  data={formData.general}
                  onChange={(data) => setFormData(prev => ({ ...prev, general: data }))}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Contact Persons */}
            <AccordionItem value="contact-persons" className="border border-gray-200 rounded-lg">
              <AccordionTrigger className="px-6 hover:no-underline">
                <span className="text-lg font-semibold">Contact Persons</span>
              </AccordionTrigger>
              <AccordionContent className="px-6">
                <BPContactPersonsForm
                  contactPersons={formData.contactPersons}
                  onChange={(contactPersons) => setFormData(prev => ({ ...prev, contactPersons }))}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Addresses */}
            <AccordionItem value="addresses" className="border border-gray-200 rounded-lg">
              <AccordionTrigger className="px-6 hover:no-underline">
                <span className="text-lg font-semibold">Addresses</span>
              </AccordionTrigger>
              <AccordionContent className="px-6">
                <BPAddressesForm
                  addresses={formData.addresses}
                  onChange={(addresses) => setFormData(prev => ({ ...prev, addresses }))}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Accounting */}
            <AccordionItem value="accounting" className="border border-gray-200 rounded-lg">
              <AccordionTrigger className="px-6 hover:no-underline">
                <span className="text-lg font-semibold">Accounting</span>
              </AccordionTrigger>
              <AccordionContent className="px-6">
                <BPAccountingForm
                  data={formData.accounting}
                  onChange={(data) => setFormData(prev => ({ ...prev, accounting: data }))}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Payment and Billing */}
            <AccordionItem value="payment-billing" className="border border-gray-200 rounded-lg">
              <AccordionTrigger className="px-6 hover:no-underline">
                <span className="text-lg font-semibold">Payment & Billing</span>
              </AccordionTrigger>
              <AccordionContent className="px-6">
                <BPPaymentForm
                  data={formData.paymentAndBilling}
                  onChange={(data) => setFormData(prev => ({ ...prev, paymentAndBilling: data }))}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Credit Control */}
            <AccordionItem value="credit-control" className="border border-gray-200 rounded-lg">
              <AccordionTrigger className="px-6 hover:no-underline">
                <span className="text-lg font-semibold">Credit Control</span>
              </AccordionTrigger>
              <AccordionContent className="px-6">
                <BPCreditControlForm
                  data={formData.creditControl}
                  onChange={(data) => setFormData(prev => ({ ...prev, creditControl: data }))}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Default Settings */}
            <AccordionItem value="default-settings" className="border border-gray-200 rounded-lg">
              <AccordionTrigger className="px-6 hover:no-underline">
                <span className="text-lg font-semibold">Default Settings</span>
              </AccordionTrigger>
              <AccordionContent className="px-6">
                <BPDefaultSettingsForm
                  data={formData.defaultSettings}
                  salesRep={formData.salesRep}
                  onChange={(data) => setFormData(prev => ({ ...prev, defaultSettings: data }))}
                  onSalesRepChange={(salesRep) => setFormData(prev => ({ ...prev, salesRep }))}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Notes */}
            <AccordionItem value="notes" className="border border-gray-200 rounded-lg">
              <AccordionTrigger className="px-6 hover:no-underline">
                <span className="text-lg font-semibold">Notes</span>
              </AccordionTrigger>
              <AccordionContent className="px-6">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Notes added here will be saved when the business partner is created.
                  </p>
                </div>
                <div className="space-y-4">
                  {formData.notes.map((note, index) => (
                    <div key={note.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{note.subject}</h4>
                          <p className="text-sm text-gray-600 mt-1">{note.note}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Action Date: {format(new Date(note.actionDate), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newNotes = formData.notes.filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, notes: newNotes }));
                          }}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newNote: BPNote = {
                        id: `temp-note-${Date.now()}`,
                        bpId: '',
                        completed: false,
                        dateOfEntry: new Date().toISOString(),
                        actionDate: new Date().toISOString().split('T')[0],
                        subject: 'New Note',
                        note: 'Note content...',
                        createdBy: 'Current User',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      };
                      setFormData(prev => ({ ...prev, notes: [...prev.notes, newNote] }));
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Note (Preview)
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* User Defined Fields */}
            <AccordionItem value="user-defined-fields" className="border border-gray-200 rounded-lg">
              <AccordionTrigger className="px-6 hover:no-underline">
                <span className="text-lg font-semibold">User Defined Fields</span>
              </AccordionTrigger>
              <AccordionContent className="px-6">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> User defined fields added here will be saved when the business partner is created.
                  </p>
                </div>
                <div className="space-y-4">
                  {formData.userDefinedFields.map((udf, index) => (
                    <div key={udf.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{udf.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Category: {udf.category} | Type: {udf.type}
                          </p>
                          <p className="text-sm text-gray-600">
                            Value: {String(udf.value)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newUDFs = formData.userDefinedFields.filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, userDefinedFields: newUDFs }));
                          }}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newUDF: UserDefinedField = {
                        id: `temp-udf-${Date.now()}`,
                        category: 'Text Information',
                        name: 'Sample Field',
                        type: 'text',
                        value: 'Sample Value',
                        description: 'Sample description',
                      };
                      setFormData(prev => ({ ...prev, userDefinedFields: [...prev.userDefinedFields, newUDF] }));
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field (Preview)
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

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

export const BPCreationPage: React.FC<BPCreationPageProps> = (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BPCreationContent {...props} />
    </QueryClientProvider>
  );
};