export interface BusinessPartner {
  id: string;
  masterData: {
    bpType: 'Customer' | 'Vendor' | 'Lead' | 'Employee';
    name: string;
    displayName: string;
    bpGroup: string;
    currency: 'EUR' | 'USD' | 'GBP' | 'GHS' | 'CFA' | 'NGN';
    tinNo: string;
  };
  general: {
    telephone1: string;
    telephone2: string;
    mobilePhone: string;
    email: string;
    industry: string;
    fax: string;
    website: string;
  };
  contactPersons: ContactPerson[];
  addresses: Address[];
  accounting: {
    controlAccountId: string;
    controlAccounts: string;
    openingBalance: number;
    openingBalanceDate: string;
  };
  paymentAndBilling: {
    paymentTerms: string;
    paymentMethods: string;
    bankName: string;
    branchName: string;
  };
  creditControl: {
    creditLimit: number;
    autoMomoDebit: boolean;
  };
  defaultSettings: {
    statementDistribution: 'None' | 'Print' | 'Email' | 'Email & Print';
    frequency: 'Every 15 days' | 'End of Month' | 'End of Quarter' | 'End of Year';
    defaultDiscount: number;
    defaultPriceList: string;
  };
  salesRep?: SalesRep;
  status: 'Active' | 'Inactive';
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactPerson {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  title: string;
  position: string;
  address: string;
  gpsAddress: string;
  telephone1: string;
  telephone2: string;
  mobilePhone: string;
  email: string;
  fax: string;
  remarks: string;
}

export interface Address {
  id: string;
  addressType: 'Bill To' | 'Ship To';
  addressName2: string;
  addressName3: string;
  poBox: string;
  streetNo: string;
  block: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  gpsAddress: string;
}

export interface SalesRep {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}

export interface BPNote {
  id: string;
  bpId: string;
  completed: boolean;
  dateOfEntry: string;
  actionDate: string;
  subject: string;
  note: string;
  attachment?: string;
  createdBy: string;
}

export interface UserDefinedField {
  id: string;
  name: string;
  type: 'text' | 'numeric' | 'boolean' | 'date';
  value: string | number | boolean | Date;
}

export interface BPTransaction {
  id: string;
  date: string;
  type: 'Invoice' | 'Payment' | 'Credit Note' | 'Debit Note';
  documentNo: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  status: 'Open' | 'Paid' | 'Overdue';
}

export interface BPSalesData {
  month: string;
  sales: number;
  invoices: number;
}

export interface BPAgedAnalysis {
  current: number;
  days30: number;
  days60: number;
  days90: number;
  over90: number;
}

export interface BPFilters {
  bpType?: ('Customer' | 'Vendor' | 'Lead' | 'Employee')[];
  group?: string;
  status?: ('Active' | 'Inactive')[];
  search?: string;
}

export interface BPStats {
  totalCustomers: number;
  totalVendors: number;
  activePartners: number;
  totalBalance: number;
}

export interface BPGroup {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface PriceList {
  id: string;
  code: string;
  name: string;
  currency: string;
}