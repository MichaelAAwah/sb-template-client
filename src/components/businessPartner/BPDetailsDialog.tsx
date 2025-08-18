import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
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
  Settings
} from 'lucide-react';
import { BusinessPartner } from '../../types/businessPartner';
import { BPOverviewTab } from './BPOverviewTab';
import { BPTrendsTab } from './BPTrendsTab';
import { BPTransactionsTab } from './BPTransactionsTab';
import { getInitials, formatBalance, getBPTypeColor, getStatusColor } from '../../api/businessPartnerData';

interface BPDetailsDialogProps {
  businessPartner: BusinessPartner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BPDetailsDialog: React.FC<BPDetailsDialogProps> = ({
  businessPartner,
  open,
  onOpenChange,
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!businessPartner) return null;

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

  const handleAddNote = () => {
    console.log('Add note for:', bp.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full ${getInitialsColor(bp.masterData.name)} flex items-center justify-center text-white font-bold`}>
              {getInitials(bp.masterData.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold">{bp.masterData.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className={getBPTypeColor(bp.masterData.bpType)}>
                  {bp.masterData.bpType}
                </Badge>
                <Badge variant="secondary" className={getStatusColor(bp.status)}>
                  {bp.status}
                </Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Header Summary */}
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

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 mb-6">
          <Button onClick={handleSetupAutoDebits} variant="outline" size="sm">
            <CreditCard className="h-4 w-4 mr-2" />
            Setup Auto Debits
          </Button>
          <Button onClick={handleManageDetails} variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Manage Details
          </Button>
          <Button onClick={handleAddNote} variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Add Note
          </Button>
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="quotations">Quotations</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
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
                <CardTitle>Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Invoice list will be implemented here
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
                <CardTitle>Sales Quotations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Sales quotations list will be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Sales orders list will be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};