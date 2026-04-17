export type AppointmentStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export interface Barber {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  commissionRate: number; // percentage
  status: 'online' | 'offline' | 'on-break';
  color: string; // hex color for agenda display
}

export interface Appointment {
  id: string;
  clientName: string;
  barberId: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  service: string;
  price: number;
  status: AppointmentStatus;
}

export interface Commission {
  barberId: string;
  totalRevenue: number;
  commissionAmount: number; // calculated based on percentage
}
