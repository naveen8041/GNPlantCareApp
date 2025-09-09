export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  healthStatus: 'healthy' | 'warning' | 'critical';
  lastWatered: Date;
  nextWatering: Date;
  diseases?: Disease[];
  careSchedule: CareSchedule;
  addedDate: Date;
}

export interface Disease {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  symptoms: string[];
  organicTreatment: Treatment;
  chemicalTreatment: Treatment;
  description: string;
}

export interface Treatment {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  price?: string;
}

export interface CareSchedule {
  watering: ScheduleItem[];
  medicine: ScheduleItem[];
  pesticide: ScheduleItem[];
}

export interface ScheduleItem {
  id: string;
  type: 'watering' | 'medicine' | 'pesticide';
  name: string;
  nextDue: Date;
  frequency: string;
  notes?: string;
  completed: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  nurseryName: string;
  registrationDate: Date;
}