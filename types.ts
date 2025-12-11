export enum TireType {
  SUMMER = 'Été',
  WINTER = 'Hiver',
  ALL_SEASON = '4 Saisons',
  PERFORMANCE = 'Performance'
}

export enum AppointmentStatus {
  PENDING = 'En attente',
  COMPLETED = 'Terminé',
  CANCELLED = 'Annulé'
}

export interface Tire {
  id: string;
  brand: string;
  model: string;
  width: number;
  ratio: number;
  diameter: number;
  price: number;
  stock: number;
  type: TireType;
  description: string;
  imageUrl?: string;
  createdAt: string;
}

export type NewTire = Omit<Tire, 'id' | 'createdAt'>;

export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  carBrand: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:00
  statut: AppointmentStatus;
  createdAt: string;
}

export type NewAppointment = Omit<Appointment, 'id' | 'createdAt'>;

export interface FilterOptions {
  search: string;
  type?: TireType | '';
}