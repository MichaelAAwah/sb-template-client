import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { LoadingSpinner } from '../ui/loading-spinner';
import { RefreshCw, Users, Plus, Upload } from 'lucide-react';
import { BPStats } from './BPStats';
import { BPFilters } from './BPFilters';
import { BPTable } from './BPTable';
import { BPDetailsPage } from './BPDetailsPage';
import { useBusinessPartners, useUpdateBusinessPartner } from '../../hooks/useBusinessPartnerData';
import { BusinessPartner, BPFilters as FiltersType } from '../../types/businessPartner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
  onNavigateToCreate?: () => void;
});

const BPListContent: React.FC<BPListPageProps> = ({
  onNavigateToCreate,
}) => {
  const [filters, setFilters] = useState<FiltersType>({});
  const [selectedBP, setSelectedBP] = useState<BusinessPartner | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');

  const { data: businessPartners, isLoading, refetch, isFetching } = useBusinessPartners(filters);
  const updateBPMutation = useUpdateBusinessPartner();

  const handleRefresh = () => {
    refetch();
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleCreateNew = () => {
    if (onNavigateToCreate) {
      onNavigateToCreate();
    }
  };

  const handleImport = () => {
    console.log('Open import dialog');
  };

  const handleView = (bp: BusinessPartner) => {
    setSelectedBP(bp);
    setViewMode('details');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedBP(null);
  };

  const handleEdit = (bp: BusinessPartner) => {
    console.log('Navigate to edit page for BP:', bp.id);
  };

  const handleActivate = async (bp: BusinessPartner) => {
    try {
      await updateBPMutation.mutateAsync({
        id: bp.id,
        updates: { status: 'Active' }
      });
    } catch (error) {
      console.error('Failed to activate BP:', error);
    }
  };

  const handleDeactivate = async (bp: BusinessPartner) => {
    try {
      await updateBPMutation.mutateAsync({
        id: bp.id,
        updates: { status: 'Inactive' }
      });
    } catch (error) {
      console.error('Failed to deactivate BP:', error);
    }
  };

  const handleSetupAutoDebits = (bp: BusinessPartner) => {
    console.log('Setup auto debits for BP:', bp.id);
  };

  if (viewMode === 'details' && selectedBP) {
    return (
      <BPDetailsPage
        businessPartnerId={selectedBP.id}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Business Partners</h1>
                <p className="text-gray-600">Manage customers, vendors, and business relationships</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isFetching}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleImport}
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Import</span>
              </Button>
              <Button
                onClick={handleCreateNew}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Create New</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <BPStats />

        {/* Filters */}
        <BPFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Business Partners Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Business Partners</span>
              <div className="text-sm font-normal text-gray-600">
                {businessPartners ? `${businessPartners.length} partners` : 'Loading...'}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : businessPartners && businessPartners.length > 0 ? (
              <BPTable
                businessPartners={businessPartners}
                onView={handleView}
                onEdit={handleEdit}
                onActivate={handleActivate}
                onDeactivate={handleDeactivate}
                onSetupAutoDebits={handleSetupAutoDebits}
              />
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No business partners found</h3>
                <p className="text-gray-600 mb-4">
                  {Object.keys(filters).length > 0 
                    ? 'Try adjusting your filters to see more partners.'
                    : 'Get started by creating your first business partner.'
                  }
                </p>
                <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Partner
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export const BPListPage: React.FC<BPListPageProps> = (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BPListContent {...props} />
    </QueryClientProvider>
  );
};