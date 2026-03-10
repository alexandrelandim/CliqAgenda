export type ServiceType = 
  | 'manicure'
  | 'cabelo'
  | 'massagem'
  | 'depilacao'
  | 'sobrancelha'
  | 'maquiagem'
  | 'estetica'
  | 'barbeiro'
  | 'cilios'
  | 'podologia'
  | 'outro';

export interface Client {
  id: string;
  name: string;
  phones: string[];
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  phone: string;
  date: string;
  time: string;
  duration: number;
  address: string;
  service: ServiceType;
  customService?: string;
  value: number;
  status: 'agendado' | 'concluido';
  paid: boolean;
  notes?: string;
  photoUrl?: string;
  createdAt: string;
}

export interface Payment {
  clientId: string;
  clientName: string;
  phone: string;
  totalOwed: number;
  appointments: Appointment[];
}
