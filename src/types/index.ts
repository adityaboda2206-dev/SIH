export interface Report {
  id: number;
  type: string;
  severity: string;
  location: string;
  description: string;
  timestamp: Date;
  verified: boolean;
  reporter: string;
  contact: string;
  coordinates: [number, number];
  images?: number;
}

export interface SocialPost {
  id: number;
  username: string;
  content: string;
  timestamp: Date;
  sentiment: string;
  platform: string;
  engagement: number;
  verified: boolean;
}

export interface Stats {
  totalReports: number;
  activeHazards: number;
  verifiedReports: number;
  socialMentions: number;
  activeUsers: number;
  coverage: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  joinedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}