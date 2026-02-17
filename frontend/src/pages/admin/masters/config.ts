
export const MASTER_CONFIG: Record<string, {
  label: string;
  columns: any[];
  fields: any[];
}> = {
  countries: {
    label: 'Countries',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'code', label: 'Code' }
    ],
    fields: [
      { name: 'name', label: 'Country Name', type: 'text', required: true },
      { name: 'code', label: 'Country Code', type: 'text' }
    ]
  },
  states: {
    label: 'States',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'code', label: 'Code' },
      { key: 'country', label: 'Country', render: (val: any) => val?.name } // Nested access
    ],
    fields: [
      { name: 'country_id', label: 'Country', type: 'select', required: true, options: [] }, // Options populated dynamically
      { name: 'name', label: 'State Name', type: 'text', required: true },
      { name: 'code', label: 'State Code', type: 'text' }
    ]
  },
  cities: {
    label: 'Cities',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'state', label: 'State', render: (val: any) => val?.name },
      { key: 'state', label: 'Country', render: (val: any) => val?.country?.name }
    ],
    fields: [
      { name: 'state_id', label: 'State', type: 'select', required: true, options: [] },
      { name: 'name', label: 'City Name', type: 'text', required: true }
    ]
  },
  transporters: {
    label: 'Transporters',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'city', label: 'City', render: (val: any) => val?.name }
    ],
    fields: [
      { name: 'name', label: 'Transporter Name', type: 'text', required: true },
      { name: 'contact_person', label: 'Contact Person', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'gstin', label: 'GSTIN', type: 'text' },
      { name: 'city_id', label: 'City', type: 'select', options: [] },
      { name: 'address', label: 'Address', type: 'text' }
    ]
  }
};
