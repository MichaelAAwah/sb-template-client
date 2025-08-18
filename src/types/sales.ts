export interface SalesQuotation {
  id: string;
  documentNo: string;
  customerName: string;
  customerCode: string;
  contactPerson: string;
  postingDate: string;
  documentDate: string;
  validUntil: string;
  shipTo: string;
  billTo: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';
  items: SalesQuotationItem[];
  salesEmployee: string;
  remarks: string;
  subtotal: number;
  discountType: 'percentage' | 'amount';
  discountValue: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  parentModule?: string;
  parentModuleId?: string;
  currency: 'EUR' | 'USD' | 'GBP' | 'GHS' | 'CFA' | 'NGN';
  exchangeRate: number;
  paymentMeans?: PaymentMeans;
}

export interface SalesQuotationItem {
  id: string;
  type: 'Item' | 'Service' | 'Resource';
  itemNo: string;
  itemName: string;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxCode: string;
  taxOnly: boolean;
  uomName: string;
  deliveryDate: string;
  location: string;
  project: string;
  originalQuantity?: number;
}

export interface SalesOrder {
  id: string;
  documentNo: string;
  customerName: string;
  customerCode: string;
  contactPerson: string;
  postingDate: string;
  documentDate: string;
  requestedDeliveryDate: string;
  shipTo: string;
  billTo: string;
  status: 'Open' | 'Released' | 'Pending Approval' | 'Pending Prepayment' | 'Completely Shipped';
  items: SalesOrderItem[];
  salesEmployee: string;
  remarks: string;
  subtotal: number;
  discountType: 'percentage' | 'amount';
  discountValue: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  parentModule?: string;
  parentModuleId?: string;
  currency: 'EUR' | 'USD' | 'GBP' | 'GHS' | 'CFA' | 'NGN';
  exchangeRate: number;
  paymentMeans?: PaymentMeans;
}

export interface SalesOrderItem {
  id: string;
  type: 'Item' | 'Service' | 'Resource';
  itemNo: string;
  itemName: string;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxCode: string;
  taxOnly: boolean;
  uomName: string;
  deliveryDate: string;
  location: string;
  project: string;
  originalQuantity?: number;
}
export interface SalesQuotationFilters {
  dateFrom?: string;
  dateTo?: string;
  customer?: string;
  status?: ('Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired')[];
}

export interface SalesOrderFilters {
  dateFrom?: string;
  dateTo?: string;
  customer?: string;
  status?: ('Open' | 'Released' | 'Pending Approval' | 'Pending Prepayment' | 'Completely Shipped')[];
}

export interface CopyDocumentData {
  id: string;
  documentNo: string;
  customerName: string;
  postingDate: string;
  total: number;
  status: string;
}

export type CopyMode = 'full' | 'partial';
export type DocumentType = 'sales-quotation' | 'sales-order';

export interface PaymentMeans {
  method: 'cheque' | 'bank-transfer' | 'cash';
  cheques?: ChequePayment[];
  bankTransfer?: BankTransferPayment;
  cash?: CashPayment;
  bankCharge?: number;
}

export interface ChequePayment {
  id: string;
  chequeNo: string;
  amount: number;
  dueDate: string;
  bankName: string;
  branch: string;
  accountNo: string;
}

export interface BankTransferPayment {
  amountReceived: number;
  transferDate: string;
  reference: string;
}

export interface CashPayment {
  amountReceived: number;
}

export interface Currency {
  code: 'EUR' | 'USD' | 'GBP' | 'GHS' | 'CFA' | 'NGN';
  name: string;
  symbol: string;
  exchangeRate: number; // Rate to GHS
}

export interface ExchangeRates {
  [key: string]: number;
}
export interface TaxGroup {
  code: string;
  name: string;
  category: 'Output Tax' | 'Input Tax';
  rate: string;
  rateValue: number;
  effectiveTerm: string;
  taxAccount: string;
  inactiveName: string;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  shipToAddress: string;
  billToAddress: string;
  currency: 'EUR' | 'USD' | 'GBP' | 'GHS' | 'CFA' | 'NGN';
}

export interface Item {
  id: string;
  no: string;
  name: string;
  description: string;
  type: 'Item' | 'Service' | 'Resource';
  unitPrice: number;
  uomName: string;
  location: string;
}

export interface SalesEmployee {
  id: string;
  code: string;
  name: string;
  email: string;
}