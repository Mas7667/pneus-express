import { Tire, NewTire, TireType, Appointment, NewAppointment, AppointmentStatus } from '../types';
import { supabase } from './supabase';

const DB_TIRES_KEY = 'pneus_express_tires_v1';
const DB_APPOINTMENTS_KEY = 'pneus_express_appointments_v1';

// Seed data for Tires
const INITIAL_TIRES: Tire[] = [
  {
    id: '1',
    brand: 'Michelin',
    model: 'X-Ice Snow',
    width: 205,
    ratio: 55,
    diameter: 16,
    price: 189.99,
    stock: 12,
    type: TireType.WINTER,
    description: 'Pneu d\'hiver haut de gamme offrant une traction exceptionnelle.',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    brand: 'Bridgestone',
    model: 'Potenza Sport',
    width: 245,
    ratio: 40,
    diameter: 19,
    price: 320.50,
    stock: 4,
    type: TireType.PERFORMANCE,
    description: 'Pneu haute performance pour une conduite sportive.',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    brand: 'Continental',
    model: 'TrueContact Tour',
    width: 195,
    ratio: 65,
    diameter: 15,
    price: 145.00,
    stock: 20,
    type: TireType.ALL_SEASON,
    description: 'Durabilité longue durée et économie de carburant.',
    createdAt: new Date().toISOString()
  }
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    clientName: 'Jean Dupont',
    clientEmail: 'jean@example.com',
    carBrand: 'Toyota',
    date: new Date().toISOString().split('T')[0], // Today
    time: '10:00',
    statut: AppointmentStatus.PENDING,
    createdAt: new Date().toISOString()
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dbService = {
  // --- TIRES ---
  getTires: async (): Promise<Tire[]> => {
    const { data, error } = await supabase
      .from('tires')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tires:', error);
      throw error;
    }
    
    // Map database columns to app interface
    return (data || []).map((tire: any) => ({
      id: tire.id,
      brand: tire.brand || '',
      model: tire.model || '',
      width: tire.width || 0,
      ratio: tire.ratio || 0,
      diameter: tire.diameter || 0,
      price: tire.price || 0,
      stock: tire.stock || 0,
      type: tire.type || '',
      description: tire.description || '',
      imageUrl: tire.image_url || null,
      createdAt: tire.created_at || new Date().toISOString()
    }));
  },

  createTire: async (tire: NewTire): Promise<Tire> => {
    const newEntry = {
      brand: tire.brand,
      model: tire.model,
      width: tire.width,
      ratio: tire.ratio,
      diameter: tire.diameter,
      price: tire.price,
      stock: tire.stock,
      type: tire.type,
      description: tire.description,
      image_url: tire.imageUrl,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('tires')
      .insert([newEntry])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating tire:', error);
      throw error;
    }
    
    // Map database columns to app interface
    return {
      id: data.id,
      brand: data.brand,
      model: data.model,
      width: data.width,
      ratio: data.ratio,
      diameter: data.diameter,
      price: data.price,
      stock: data.stock,
      type: data.type,
      description: data.description,
      imageUrl: data.image_url,
      createdAt: data.created_at
    };
  },

  updateTire: async (id: string, updates: Partial<Tire>): Promise<Tire> => {
    // Map app interface to database columns
    const dbUpdates: any = {};
    if (updates.brand !== undefined) dbUpdates.brand = updates.brand;
    if (updates.model !== undefined) dbUpdates.model = updates.model;
    if (updates.width !== undefined) dbUpdates.width = updates.width;
    if (updates.ratio !== undefined) dbUpdates.ratio = updates.ratio;
    if (updates.diameter !== undefined) dbUpdates.diameter = updates.diameter;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
    
    const { data, error } = await supabase
      .from('tires')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating tire:', error);
      throw error;
    }
    
    if (!data) throw new Error("Tire not found");
    
    // Map database columns to app interface
    return {
      id: data.id,
      brand: data.brand,
      model: data.model,
      width: data.width,
      ratio: data.ratio,
      diameter: data.diameter,
      price: data.price,
      stock: data.stock,
      type: data.type,
      description: data.description,
      imageUrl: data.image_url,
      createdAt: data.created_at
    };
  },

  deleteTire: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('tires')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting tire:', error);
      throw error;
    }
  },

  // --- APPOINTMENTS ---
  getAppointments: async (): Promise<Appointment[]> => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });
    
    if (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
    
    // Map database columns to app interface
    return (data || []).map((apt: any) => ({
      id: apt.id,
      clientName: apt.client_name,
      clientEmail: apt.client_email,
      carBrand: apt.car_brand,
      date: apt.appointment_date,
      time: apt.appointment_time,
      statut: apt.statut || AppointmentStatus.PENDING,
      createdAt: apt.created_at
    }));
  },

  createAppointment: async (apt: NewAppointment): Promise<Appointment> => {
    // Business Logic: Check capacity (Max 3)
    const { data: existingInSlot, error: checkError } = await supabase
      .from('appointments')
      .select('*')
      .eq('appointment_date', apt.date)
      .eq('appointment_time', apt.time);
    
    if (checkError) {
      console.error('Error checking appointments:', checkError);
      throw checkError;
    }
    
    if (existingInSlot && existingInSlot.length >= 3) {
      throw new Error("Ce créneau horaire est complet (Maximum 3 rendez-vous).");
    }

    const newEntry = {
      client_name: apt.clientName,
      client_email: apt.clientEmail,
      car_brand: apt.carBrand,
      appointment_date: apt.date,
      appointment_time: apt.time,
      statut: AppointmentStatus.PENDING,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('appointments')
      .insert([newEntry])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }

    // Map database columns to app interface
    return {
      id: data.id,
      clientName: data.client_name,
      clientEmail: data.client_email,
      carBrand: data.car_brand,
      date: data.appointment_date,
      time: data.appointment_time,
      statut: data.statut || AppointmentStatus.PENDING,
      createdAt: data.created_at
    };
  },

  updateAppointment: async (id: string, updates: Partial<Appointment>): Promise<Appointment> => {
    // Map app interface to database columns
    const dbUpdates: any = {};
    if (updates.clientName !== undefined) dbUpdates.client_name = updates.clientName;
    if (updates.clientEmail !== undefined) dbUpdates.client_email = updates.clientEmail;
    if (updates.carBrand !== undefined) dbUpdates.car_brand = updates.carBrand;
    if (updates.date !== undefined) dbUpdates.appointment_date = updates.date;
    if (updates.time !== undefined) dbUpdates.appointment_time = updates.time;
    if (updates.statut !== undefined) dbUpdates.statut = updates.statut;
    
    console.log('🔄 Mise à jour Supabase:', { id, updates, dbUpdates });
    
    const { data, error } = await supabase
      .from('appointments')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erreur Supabase update:', error);
      throw error;
    }
    
    if (!data) throw new Error("Appointment not found");
    
    console.log('✅ Rendez-vous mis à jour:', data);
    
    // Map database columns to app interface
    return {
      id: data.id,
      clientName: data.client_name,
      clientEmail: data.client_email,
      carBrand: data.car_brand,
      date: data.appointment_date,
      time: data.appointment_time,
      statut: data.statut || AppointmentStatus.PENDING,
      createdAt: data.created_at
    };
  },

  deleteAppointment: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  },

  // RESET ALL - For development only
  reset: async () => {
    console.warn('Reset function disabled with Supabase. Please manage data through Supabase dashboard.');
  }
};