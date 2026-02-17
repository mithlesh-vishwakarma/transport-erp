import { supabase } from './supabaseClient';

export const masterService = {
  // Generic Fetch
  getAll: async (table: string) => {
    let query = supabase.from(`master_${table}`).select('*');
    
    // Add specific joins based on table
    if (table === 'states') {
      query = supabase.from(`master_${table}`).select('*, country:master_countries(name)');
    } else if (table === 'cities') {
      query = supabase.from(`master_${table}`).select('*, state:master_states(name, country:master_countries(name))');
    } else if (table === 'transporters') {
      query = supabase.from(`master_${table}`).select('*, city:master_cities(name)');
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Generic Create
  create: async (table: string, payload: any) => {
    const { data, error } = await supabase.from(`master_${table}`).insert([payload]).select().single();
    if (error) throw error;
    return data;
  },

  // Generic Update
  update: async (table: string, id: string, payload: any) => {
    const { data, error } = await supabase.from(`master_${table}`).update(payload).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  // Generic Delete
  delete: async (table: string, id: string) => {
    const { error } = await supabase.from(`master_${table}`).delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};
