// User types
export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  rating: number;
  dateOfBirth?: string;
  homeAddress?: string;
  mobilePhoneNumber?: string;
  vehicleType?: string;
  vehiclePlate?: string;
  driversLicenseNumber?: string;
}

// Ride types
export interface RideOffer {
  id: string;
  driverId: string;
  driver: User;
  origin: string;
  destination: string;
  departureDateTime: string;
  vehicleType: VehicleType;
  seatCapacity: number;
  availableSeats: number;
  distanceKm: number;
  voucherRequirement: VoucherSize;
  status: 'active' | 'completed' | 'cancelled';
  passengers: RidePassenger[];
  createdAt: string;
}

export interface RideRequest {
  id: string;
  passengerId: string;
  passenger: User;
  origin: string;
  destination: string;
  preferredDate: string; 
  preferredTimeFrom: string;   
  preferredTimeTo: string; 
  distanceKm: number;
  voucherRequirement: VoucherSize;
  status: 'active' | 'matched' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface RidePassenger {
  id: string;
  userId: string;
  user: User;
  rideOfferId: string;
  joinedAt: string;
  status: 'confirmed' | 'cancelled';
}

// Vehicle types
export type VehicleType = 'Car' | 'SUV' | 'Motorcycle' | 'Truck' | 'Bicycle' | 'Scooter';

// Voucher types
export type VoucherSize = 'short' | 'tall' | 'grande' | 'venti' | 'trenta';

export interface VoucherCalculation {
  size: VoucherSize;
  distanceKm: number;
  vehicleType: VehicleType;
}

// Form types
export interface RideOfferForm {
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  vehicleType: VehicleType;
  seatCapacity: number;
  distanceKm: number;
}

export interface RideRequestForm {
  origin: string;
  destination: string;
  preferredDate: string;
  preferredTimeFrom: string;
  preferredTimeTo: string;
  distanceKm: number;
}

// Filter types
export interface RideBoardFilters {
  date?: string;
  timeFrom?: string;
  timeTo?: string;
  destination?: string;
  origin?: string;
  voucherSize?: VoucherSize;
  rideType?: 'offers' | 'requests' | 'both';
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: number;
  autoHide?: boolean;
}
