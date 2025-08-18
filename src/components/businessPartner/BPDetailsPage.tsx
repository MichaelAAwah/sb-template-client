import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LoadingSpinner } from '../ui/loading-spinner';
import { 
  ArrowLeft,
  User, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  TrendingUp,
  FileText,
  DollarSign,
  Calendar,
  Building,
  Settings,
  Users,
  ShoppingCart,
  Receipt
} from 'lucide-react';
import { BusinessPartner } from '../../types/businessPartner';
import { BPOverviewTab } from './BPOverviewTab';
import { BPTrendsTab } from './BPTrendsTab';
import { BPTransactionsTab } from './BPTransactionsTab';
import { BPNotesManager } from './BPNotesManager';
import { BPUDFManager } from './BPUDFManager';
import { useBusinessPartner } from '../../hooks/useBusinessPartnerData';
import { getInitials, formatBalance, getBPTypeColor, getStatusColor } from '../../api/businessPartnerData';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

interface BPDetailsPageProps {
  businessPartnerId: string;
  onBack: () => void;
}

const BPDetailsPageContent: React.FC<BPDetailsPageProps> = ({
  businessPartnerId,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: businessPartner, isLoading } = useBusinessPartner(businessPartnerId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!businessPartner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Business Partner Not Found</h2>
          <p className="text-gray-600 mb-4">The requested business partner could not be found.</p>
          <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  const bp = businessPartner;
  const primaryContact = bp.contactPersons[0];
  const primaryAddress = bp.addresses[0];

  const getInitialsColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 
      'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-red-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleSetupAutoDebits = () => {
    console.log('Setup auto debits for:', bp.id);
  };

  const handleManageDetails = () => {
    console.log('Manage details for:', bp.id);
  };

  const handleEdit = () => {
    console.log('Edit business partner:', bp.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full ${getInitialsColor(bp.masterData.name)} flex items-center justify-center text-white font-bold`}>
                  {getInitials(bp.masterData.name)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{bp.masterData.name}</h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className={getBPTypeColor(bp.masterData.bpType)}>
                      {bp.masterData.bpType}
                    </Badge>
                    <Badge variant="secondary" className={getStatusColor(bp.status)}>
                      {bp.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={handleEdit} variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
              <Button onClick={handleSetupAutoDebits} variant="outline">
                <CreditCard className="h-4 w-4 mr-2" />
                Setup Auto Debits
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Current Balance</p>
                <p className={`text-lg font-bold ${bp.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatBalance(bp.balance, bp.masterData.currency)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Credit Limit</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatBalance(bp.creditControl.creditLimit, bp.masterData.currency)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Group</p>
                <p className="text-lg font-semibold text-gray-900">{bp.masterData.bpGroup}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Currency</p>
                <p className="text-lg font-semibold text-gray-900">{bp.masterData.currency}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Primary Contact */}
          {primaryContact && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Primary Contact</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-semibold">
                  {primaryContact.title} {primaryContact.firstName} {primaryContact.lastName}
                </p>
                <p className="text-sm text-gray-600">{primaryContact.position}</p>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-3 w-3 text-gray-400" />
                    <span>{primaryContact.mobilePhone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-3 w-3 text-gray-400" />
                    <span>{primaryContact.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Primary Address */}
          {primaryAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Primary Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{primaryAddress.addressType}</p>
                  <p>{primaryAddress.streetNo} {primaryAddress.city}</p>
                  <p>{primaryAddress.state}, {primaryAddress.country}</p>
                  {primaryAddress.gpsAddress && (
                    <p className="text-gray-600">GPS: {primaryAddress.gpsAddress}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="quotations">Quotations</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="udfs">UDFs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <BPOverviewTab businessPartner={bp} />
          </TabsContent>

          <TabsContent value="trends" className="mt-6">
            <BPTrendsTab businessPartnerId={bp.id} />
          </TabsContent>

          <TabsContent value="invoices" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Receipt className="h-5 w-5" />
                  <span>Invoices</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Invoices Module</h3>
                  <p className="text-gray-600">
                    Invoice management for this business partner will be implemented here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="mt-6">
            <BPTransactionsTab businessPartnerId={bp.id} />
          </TabsContent>

          <TabsContent value="quotations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Sales Quotations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sales Quotations</h3>
                  <p className="text-gray-600">
                    Sales quotations linked to this business partner will be displayed here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Sales Orders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sales Orders</h3>
                  <p className="text-gray-600">
                    Sales orders linked to this business partner will be displayed here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <BPNotesManager bpId={bp.id} />
          </TabsContent>

          <TabsContent value="udfs" className="mt-6">
            <BPUDFManager bpId={bp.id} readOnly />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export const BPDetailsPage: React.FC<BPDetailsPageProps> = ({
  businessPartnerId,
  onBack,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BPDetailsPageContent 
        businessPartnerId={businessPartnerId}
        onBack={onBack}
      />
    </QueryClientProvider>
  );
};