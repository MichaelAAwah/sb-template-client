import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, FileText } from 'lucide-react';
import { useSalesQuotations } from '../../hooks/useSalesData';
import { LoadingSpinner } from '../ui/loading-spinner';
import { format } from 'date-fns';

export const SalesQuotationRecents: React.FC = () => {
  const { data: quotations, isLoading } = useSalesQuotations();

  const recentQuotations = quotations?.slice(0, 10) || [];

  const getStatusColor = (status: string) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Sent': 'bg-blue-100 text-blue-800',
      'Accepted': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Expired': 'bg-orange-100 text-orange-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Recent Quotations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner size="sm" />
          </div>
        ) : recentQuotations.length > 0 ? (
          <div className="space-y-3">
            {recentQuotations.map((quotation) => (
              <div
                key={quotation.id}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="font-mono text-sm font-medium">
                      {quotation.documentNo}
                    </span>
                  </div>
                  <Badge variant="secondary" className={getStatusColor(quotation.status)}>
                    {quotation.status}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {quotation.customerName}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{format(new Date(quotation.postingDate), 'MMM dd')}</span>
                    <span className="font-semibold">
                      ₵{quotation.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No recent quotations</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};