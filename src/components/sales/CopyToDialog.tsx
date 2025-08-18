import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { LoadingSpinner } from '../ui/loading-spinner';
import { Copy, FileText, ShoppingCart } from 'lucide-react';
import { CopyMode, DocumentType } from '../../types/sales';

interface CopyToDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceDocumentNo: string;
  sourceType: DocumentType;
  onCopy: (targetType: DocumentType, mode: CopyMode) => void;
  isLoading?: boolean;
}

export const CopyToDialog: React.FC<CopyToDialogProps> = ({
  open,
  onOpenChange,
  sourceDocumentNo,
  sourceType,
  onCopy,
  isLoading = false,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<DocumentType | null>(null);
  const [selectedMode, setSelectedMode] = useState<CopyMode>('full');

  const availableTargets = [
    {
      type: 'sales-order' as DocumentType,
      title: 'Sales Order',
      description: 'Create a sales order from this quotation',
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
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

  const handleCopy = () => {
    if (selectedTarget) {
      onCopy(selectedTarget, selectedMode);
      onOpenChange(false);
      setSelectedTarget(null);
      setSelectedMode('full');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedTarget(null);
    setSelectedMode('full');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Copy className="h-5 w-5" />
            <span>Copy {sourceType === 'sales-quotation' ? 'Quotation' : 'Order'} {sourceDocumentNo}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Target Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Copy to:</h3>
            <div className="grid grid-cols-1 gap-3">
              {availableTargets.map((target) => {
                const Icon = target.icon;
                const isSelected = selectedTarget === target.type;
                
                return (
                  <Card
                    key={target.type}
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? `${target.borderColor} border-2 ${target.bgColor}` 
                        : 'border hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTarget(target.type)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${target.bgColor}`}>
                          <Icon className={`h-5 w-5 ${target.color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{target.title}</h4>
                          <p className="text-sm text-gray-600">{target.description}</p>
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

          {/* Copy Mode Selection */}
          {selectedTarget && (
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
            disabled={!selectedTarget || isLoading}
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
                Copy to {selectedTarget ? availableTargets.find(t => t.type === selectedTarget)?.title : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};