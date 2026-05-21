
export enum Language {
  ENGLISH = 'en',
  TELUGU = 'te',
  HINDI = 'hi',
  TAMIL = 'ta',
  KANNADA = 'kn',
  MARATHI = 'mr',
  BENGALI = 'bn',
  MALAYALAM = 'ml',
  GUJARATI = 'gu',
  PUNJABI = 'pa'
}

export interface UserProfile {
  name: string;
  location: string;
  primaryCrop: string;
  language: Language;
  emergencyContacts: string[];
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  prediction: string;
}

export interface MarketPrice {
  crop: string;
  price: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  image?: string;
}

export interface DiseaseAnalysis {
  name: string;
  confidence: number;
  symptoms: string[];
  treatment: string[];
  preventiveMeasures: string[];
  explanation: string;
}
export interface FarmActivity {
  id: string;
  type: 'sowing' | 'irrigation' | 'fertilizer' | 'pesticide' | 'harvesting' | 'weeding' | 'pruning' | 'other';
  crop: string;
  date: number; // timestamp
  details: string;
  location?: string;
  cost?: number;
  yield?: number;
  notes?: string;
  images?: string[];
}

export interface GovtScheme {
  id: string;
  name: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  applicationDeadline?: string;
  minimumLandHolding?: number;
  subsidy?: string;
  website?: string;
  state?: string;
  category: 'subsidy' | 'insurance' | 'loan' | 'training' | 'infrastructure';
  available: boolean;
}

export interface VoiceInteraction {
  id: string;
  timestamp: number;
  language: Language;
  detectedLanguage: Language;
  query: string; // original voice input
  crops: string[]; // detected crop names
  response: string; // AI response
  duration?: number; // in seconds
}
