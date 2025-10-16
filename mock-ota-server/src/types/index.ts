// OTA Provider Types
export enum OTAProvider {
  AIRBNB = 'airbnb',
  BOOKING = 'booking',
  EXPEDIA = 'expedia',
  AGODA = 'agoda',
  VRBO = 'vrbo'
}

// Property Types
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface Room {
  id: string;
  name: string;
  type: string;
  maxGuests: number;
}

export interface Property {
  id: string;
  name: string;
  type: string;
  address: Address;
  status: string;
  createdAt: Date;
}

export interface Booking {
  id: string;
  propertyId: string;
  status: string;
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: any;
}
