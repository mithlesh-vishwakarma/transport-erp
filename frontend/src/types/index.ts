export interface Company {
  id: string;
  name: string;
  created_at: string;
}

export interface AccountingYear {
  id: string;
  label: string;
}

export interface MVEntry {
  id: string;
  company_id: string;
  accounting_year: string;
  entry_date: string;
  from_city: string;
  to_city: string;
  party_name: string;
  transporter_name: string;
  freight: number;
  advance_paid: number;
  hamali: number;
  detention: number;
  commission: number;
  party_advance: number;
  pod_received: boolean;
  transporter_balance: number;
  party_balance: number;
  net_profit: number;
  created_at: string;
}

export interface JPLR {
  id: string;
  company_id: string;
  accounting_year: string;
  lr_number: number;
  lr_date: string;
  from_city: string;
  to_city: string;
  vehicle_no: string;
  consignor: string;
  consignee: string;
  material: string;
  weight: number;
  eway_bill: string;
  payment_type: string;
  created_at: string;
}

export interface JPInvoice {
  id: string;
  company_id: string;
  accounting_year: string;
  invoice_number: number;
  invoice_date: string;
  party_name: string;
  lr_id: string;
  freight: number;
  hamali: number;
  detention: number;
  other: number;
  total: number;
  pdf_url: string;
  created_at: string;
  // Joins
  lr?: JPLR;
}

export interface Expense {
  id: string;
  company_id: string;
  accounting_year: string;
  expense_date: string;
  expense_type: string;
  note: string;
  amount: number;
  created_at: string;
}

export * from './masters';
