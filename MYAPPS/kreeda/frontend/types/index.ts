export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  dateOfBirth?: string;
  height?: string;
  weight?: string;
  primarySport?: string;
  achievements: Achievement[];
  certificates: Certificate[];
  stats: UserStats;
  socialLinks?: SocialLinks;
}

export interface Profile extends User {
  achievements: Achievement[];
  sports: Sport[];
  certificates: Certificate[];
  stats: Stats;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  imageUrl: string;
}

export interface UserStats {
  totalEvents: number;
  totalAchievements: number;
  totalCertificates: number;
  experiencePoints: number;
  level: number;
}

export interface SocialLinks {
  instagram?: string;
  youtube?: string;
  twitter?: string;
  linkedin?: string;
}

export interface Sport {
  id: string;
  name: string;
  level?: string;
  experience?: number;
  category?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  rules?: string[];
  equipment?: string[];
  olympicStatus?: string;
  history?: string;
  popularCountries?: string[];
  stats?: {
    totalAthletes: number;
    worldRecord: string;
    olympicRecords: string[];
  };
}

export interface Stats {
  totalEvents: number;
  totalAchievements: number;
  totalSports: number;
  totalCertificates: number;
  experiencePoints: number;
  level: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  sport: string;
  date: string;
  startTime: string;
  endTime: string;
  location: {
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  organizer: string;
  maxParticipants: number;
  currentParticipants: number;
  entryFee?: number;
  requirements: string[];
  prizes?: string[];
  image?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  participants: string[];
}

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'equipment' | 'apparel' | 'accessories' | 'nutrition';
  sport?: string;
  images: string[];
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  specifications?: Record<string, string>;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  sport?: string;
  image: string;
  tags: string[];
  readTime: number;
}

export interface Stadium {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  sports: string[];
  capacity: number;
  facilities: string[];
  rating: number;
  image: string;
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}