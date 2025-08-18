import React from 'react';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Eye, Edit, Copy, Send, Trash2 } from 'lucide-react';
import { SalesQuotation } from '../../types/sales';
import { CopyToDialog } from './CopyToDialog';
import { CopyMode, DocumentType } from '../../types/sales';
import { format } from 'date-fns';

interface SalesQuotationTableProps {
  quotations: SalesQuotation[];
}

export const SalesQuotationTable: React.FC<SalesQuotationTableProps> = ({
  quotations,
}) => {
  const [showCopyToDialog, setShowCopyToDialog] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<SalesQuotation | null>(null);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Draft': { className: 'bg-gray-100 text-gray-800' },
      'Sent': { className: 'bg-blue-100 text-blue-800' },
      'Accepted': { className: 'bg-green-100 text-green-800' },
      'Rejected': { className: 'bg-red-100 text-red-800' },
      'Expired': { className: 'bg-orange-100 text-orange-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { className: 'bg-gray-100 text-gray-800' };
    return (
      <Badge variant="secondary" className={config.className}>
        {status}
      </Badge>
    );
  };

  const handleView = (quotation: SalesQuotation) => {
    console.log('View quotation:', quotation.id);
  };

  const handleEdit = (quotation: SalesQuotation) => {
    console.log('Edit quotation:', quotation.id);
  };

  const handleCopy = (quotation: SalesQuotation) => {
    setSelectedQuotation(quotation);
    setShowCopyToDialog(true);
  };

  const handleCopyTo = (targetType: DocumentType, mode: CopyMode) => {
    if (selectedQuotation) {
      console.log(`Copying quotation ${selectedQuotation.id} to ${targetType} in ${mode} mode`);
      // Here you would implement the actual copy logic
      // For now, we'll just log it
    }
  };

  const handleSend = (quotation: SalesQuotation) => {
    console.log('Send quotation:', quotation.id);
  };

  const handleDelete = (quotation: SalesQuotation) => {
    console.log('Delete quotation:', quotation.id);
  };

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document No.</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Posting Date</TableHead>
            <TableHead>Valid Until</TableHead>
            <TableHead>Total (GHS)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotations.map((quotation) => (
            <TableRow key={quotation.id} className="hover:bg-muted/50">
              <TableCell className="font-mono text-sm font-medium">
                {quotation.documentNo}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{quotation.customerName}</p>
                  <p className="text-sm text-gray-500">{quotation.customerCode}</p>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(quotation.postingDate), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                <div className={isExpired(quotation.validUntil) ? 'text-red-600' : ''}>
                  {format(new Date(quotation.validUntil), 'MMM dd, yyyy')}
                  {isExpired(quotation.validUntil) && (
                    <span className="text-xs block">Expired</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-semibold">
                ₵{quotation.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </TableCell>
              <TableCell>{getStatusBadge(quotation.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(quotation)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(quotation)}
                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(quotation)}
                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  {quotation.status === 'Draft' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSend(quotation)}
                      className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(quotation)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Copy To Dialog */}
      <CopyToDialog
        open={showCopyToDialog}
        onOpenChange={setShowCopyToDialog}
        sourceDocumentNo={selectedQuotation?.documentNo || ''}
        sourceType="sales-quotation"
        onCopy={handleCopyTo}
      />
    </div>
  );
};