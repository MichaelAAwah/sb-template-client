import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  Eye, 
  Edit, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  CreditCard,
  Phone,
  MapPin,
  User
} from 'lucide-react';
import { BusinessPartner } from '../../types/businessPartner';
import { getInitials, formatBalance, getBPTypeColor, getStatusColor } from '../../api/businessPartnerData';

interface BPTableProps {
  businessPartners: BusinessPartner[];
  onView: (bp: BusinessPartner) => void;
  onEdit: (bp: BusinessPartner) => void;
  onActivate: (bp: BusinessPartner) => void;
  onDeactivate: (bp: BusinessPartner) => void;
  onSetupAutoDebits: (bp: BusinessPartner) => void;
}

export const BPTable: React.FC<BPTableProps> = ({
  businessPartners,
  onView,
  onEdit,
  onActivate,
  onDeactivate,
  onSetupAutoDebits,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (bpId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(bpId)) {
      newExpanded.delete(bpId);
    } else {
      newExpanded.add(bpId);
    }
    setExpandedRows(newExpanded);
  };

  const getInitialsColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 
      'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-red-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>BP Details</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {businessPartners.map((bp) => (
            <React.Fragment key={bp.id}>
              <TableRow 
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => toggleRowExpansion(bp.id)}
              >
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full ${getInitialsColor(bp.masterData.name)} flex items-center justify-center text-white font-semibold text-sm`}>
                      {getInitials(bp.masterData.name)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{bp.masterData.name}</p>
                      <p className="text-sm text-gray-500 font-mono">{bp.id.toUpperCase()}</p>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge variant="secondary" className={getBPTypeColor(bp.masterData.bpType)}>
                    {bp.masterData.bpType}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <span className="text-sm">{bp.masterData.bpGroup}</span>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    {bp.general.telephone1 && (
                      <div className="flex items-center space-x-1 text-sm">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span>{bp.general.telephone1}</span>
                      </div>
                    )}
                    {bp.general.email && (
                      <div className="text-sm text-gray-600">{bp.general.email}</div>
                    )}
                    {bp.contactPersons.length > 0 && (
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <User className="h-3 w-3" />
                        <span>{bp.contactPersons[0].firstName} {bp.contactPersons[0].lastName}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <span className={`font-semibold ${bp.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatBalance(bp.balance, bp.masterData.currency)}
                  </span>
                </TableCell>
                
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(bp.status)}>
                    {bp.status}
                  </Badge>
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(bp);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(bp);
                      }}
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {bp.status === 'Active' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeactivate(bp);
                        }}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onActivate(bp);
                        }}
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetupAutoDebits(bp);
                      }}
                      className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700"
                    >
                      <CreditCard className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              
              {/* Expanded Row Details */}
              {expandedRows.has(bp.id) && (
                <TableRow className="bg-gray-50">
                  <TableCell colSpan={7}>
                    <div className="py-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Contact Details */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Contact Details</h4>
                          <div className="space-y-1 text-sm">
                            {bp.general.mobilePhone && (
                              <div className="flex items-center space-x-2">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span>Mobile: {bp.general.mobilePhone}</span>
                              </div>
                            )}
                            {bp.general.website && (
                              <div className="text-blue-600 hover:underline">
                                <a href={`https://${bp.general.website}`} target="_blank" rel="noopener noreferrer">
                                  {bp.general.website}
                                </a>
                              </div>
                            )}
                            <div>Industry: {bp.general.industry}</div>
                          </div>
                        </div>

                        {/* Address */}
                        {bp.addresses.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Primary Address</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-start space-x-2">
                                <MapPin className="h-3 w-3 text-gray-400 mt-1" />
                                <div>
                                  <div>{bp.addresses[0].streetNo} {bp.addresses[0].city}</div>
                                  <div className="text-gray-600">{bp.addresses[0].state}, {bp.addresses[0].country}</div>
                                  {bp.addresses[0].gpsAddress && (
                                    <div className="text-gray-500">GPS: {bp.addresses[0].gpsAddress}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Financial Info */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Financial Info</h4>
                          <div className="space-y-1 text-sm">
                            <div>Credit Limit: {formatBalance(bp.creditControl.creditLimit, bp.masterData.currency)}</div>
                            <div>Payment Terms: {bp.paymentAndBilling.paymentTerms}</div>
                            {bp.salesRep && (
                              <div>Sales Rep: {bp.salesRep.firstName} {bp.salesRep.lastName}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};