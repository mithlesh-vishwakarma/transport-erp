export interface MasterCountry {
  id: string;
  name: string;
  code?: string;
  created_at: string;
  updated_at: string;
}

export interface MasterState {
  id: string;
  country_id: string;
  name: string;
  code?: string;
  created_at: string;
  updated_at: string;
  country?: MasterCountry;
}

export interface MasterCity {
  id: string;
  state_id?: string;
  name: string;
  created_at: string;
  updated_at: string;
  state?: MasterState;
}

export interface MasterTransporter {
  id: string;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  city_id?: string;
  gstin?: string;
  created_at: string;
  updated_at: string;
  city?: MasterCity;
}

export type MasterType = 'countries' | 'states' | 'cities' | 'transporters';
