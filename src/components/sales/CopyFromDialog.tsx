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
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { LoadingSpinner } from '../ui/loading-spinner';
import { Copy, Search, FileText } from 'lucide-react';
import { CopyMode, DocumentType, CopyDocumentData } from '../../types/sales';
import { useCopyableDocuments } from '../../hooks/useSalesData';
import { format } from 'date-fns';

interface CopyFromDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetType: DocumentType;
  onCopy: (sourceType: DocumentType, sourceId: string, mode: CopyMode) => void;
  isLoading?: boolean;
}

export const CopyFromDialog: React.FC<CopyFromDialogProps> = ({
  open,
  onOpenChange,
  targetType,
  onCopy,
  isLoading = false,
}) => {
  const [selectedSource, setSelectedSource] = useState<DocumentType>('sales-quotation');
  const [selectedDocument, setSelectedDocument] = useState<CopyDocumentData | null>(null);
  const [selectedMode, setSelectedMode] = useState<CopyMode>('full');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: documents, isLoading: documentsLoading, refetch } = useCopyableDocuments(selectedSource);

  React.useEffect(() => {
    if (open && selectedSource) {
      refetch();
    }
  }, [open, selectedSource, refetch]);

  const availableSources = [
    {
      type: 'sales-quotation' as DocumentType,
      title: 'Sales Quotation',
      description: 'Copy from an existing sales quotation',
    },
  ];

  const copyModes = [
    {
      mode: 'full' as CopyMode,
      title: 'Full Copy',
      description: 'Copy all fields and items with their quantities',
    },
    {
      mode: 'partial' as CopyMode,
      title: 'Partial Copy',
      description: 'Copy all fields but allow editing item quantities while keeping original quantities visible',
    },
  ];

  const filteredDocuments = documents?.filter(doc =>
    doc.documentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Sent': 'bg-blue-100 text-blue-800',
      'Accepted': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Expired': 'bg-orange-100 text-orange-800',
      'Open': 'bg-blue-100 text-blue-800',
      'Released': 'bg-green-100 text-green-800',
      'Pending Approval': 'bg-yellow-100 text-yellow-800',
      'Pending Prepayment': 'bg-orange-100 text-orange-800',
      'Completely Shipped': 'bg-emerald-100 text-emerald-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleCopy = () => {
    if (selectedDocument) {
      onCopy(selectedSource, selectedDocument.id, selectedMode);
      onOpenChange(false);
      setSelectedDocument(null);
      setSelectedMode('full');
      setSearchTerm('');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedDocument(null);
    setSelectedMode('full');
    setSearchTerm('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Copy className="h-5 w-5" />
            <span>Copy to {targetType === 'sales-order' ? 'Sales Order' : 'Sales Quotation'}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Source Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Copy from:</h3>
            <div className="grid grid-cols-1 gap-3">
              {availableSources.map((source) => {
                const isSelected = selectedSource === source.type;
                
                return (
                  <Card
                    key={source.type}
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-200 border-2 bg-blue-50' 
                        : 'border hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedSource(source.type)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gray-100">
                          <FileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{source.title}</h4>
                          <p className="text-sm text-gray-600">{source.description}</p>
                        </div>
                        {isSelected && (
                          <Badge className="bg-blue-600 text-white">Selected</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Document Selection */}
          {selectedSource && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Select document:</h3>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by document number or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Documents Table */}
              {documentsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="border rounded-lg max-h-64 overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white">
                      <TableRow>
                        <TableHead>Document No.</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.map((doc) => {
                        const isSelected = selectedDocument?.id === doc.id;
                        
                        return (
                          <TableRow
                            key={doc.id}
                            className={`cursor-pointer ${
                              isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedDocument(doc)}
                          >
                            <TableCell className="font-mono text-sm">{doc.documentNo}</TableCell>
                            <TableCell>{doc.customerName}</TableCell>
                            <TableCell>{format(new Date(doc.postingDate), 'MMM dd, yyyy')}</TableCell>
                            <TableCell className="font-semibold">
                              ₵{doc.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={getStatusColor(doc.status)}>
                                {doc.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {isSelected && (
                                <Badge className="bg-blue-600 text-white">Selected</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}

          {/* Copy Mode Selection */}
          {selectedDocument && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Copy mode:</h3>
              <div className="space-y-3">
                {copyModes.map((mode) => {
                  const isSelected = selectedMode === mode.mode;
                  
                  return (
                    <Card
                      key={mode.mode}
                      className={`cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-blue-200 border-2 bg-blue-50' 
                          : 'border hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedMode(mode.mode)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{mode.title}</h4>
                            <p className="text-sm text-gray-600">{mode.description}</p>
                          </div>
                          {isSelected && (
                            <Badge className="bg-blue-600 text-white">Selected</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCopy}
            disabled={!selectedDocument || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Copying...
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Document
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};