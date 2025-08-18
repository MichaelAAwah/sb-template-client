import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { LoadingSpinner } from '../ui/loading-spinner';
import { RefreshCw, FileText, Plus } from 'lucide-react';
import { SalesQuotationFilters } from './SalesQuotationFilters';
import { SalesQuotationTable } from './SalesQuotationTable';
import { useSalesQuotations } from '../../hooks/useSalesData';
import { SalesQuotationFilters as FiltersType } from '../../types/sales';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

const SalesQuotationListContent: React.FC = () => {
  const [filters, setFilters] = useState<FiltersType>({});
  const { data: quotations, isLoading, refetch, isFetching } = useSalesQuotations(filters);

  const handleRefresh = () => {
    refetch();
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleCreateNew = () => {
    // Navigate to creation page - placeholder for routing
    console.log('Navigate to sales quotation creation page');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sales Quotations</h1>
                <p className="text-gray-600">Manage customer quotations and proposals</p>
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
                onClick={handleCreateNew}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Create New Quotation</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <SalesQuotationFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Quotations Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Sales Quotations</span>
              <div className="text-sm font-normal text-gray-600">
                {quotations ? `${quotations.length} quotations` : 'Loading...'}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : quotations && quotations.length > 0 ? (
              <SalesQuotationTable quotations={quotations} />
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No quotations found</h3>
                <p className="text-gray-600 mb-4">
                  {Object.keys(filters).length > 0 
                    ? 'Try adjusting your filters to see more quotations.'
                    : 'Get started by creating your first sales quotation.'
                  }
                </p>
                <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Quotation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const SalesQuotationListPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SalesQuotationListContent />
    </QueryClientProvider>
  );
};