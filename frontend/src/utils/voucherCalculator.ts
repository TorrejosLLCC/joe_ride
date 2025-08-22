import type { VoucherSize, VehicleType } from "../types";

// Voucher requirement matrix based on distance + vehicle type
const VOUCHER_MATRIX: Record<string, Record<VoucherSize, number>> = {
  Motorcycle: {
    short: 5,
    tall: 8,
    grande: 12,
    venti: 18,
    trenta: 24
  },
  Car: {
    short: 3,
    tall: 5,
    grande: 9,
    venti: 14,
    trenta: 18
  },
  SUV: {
    short: 3,
    tall: 5,
    grande: 9,
    venti: 14,
    trenta: 18
  },
  Truck: {
    short: 2,
    tall: 3,
    grande: 5,
    venti: 10,
    trenta: 14
  },
  Scooter: {
    short: 2,
    tall: 3,
    grande: 5,
    venti: 10,
    trenta: 14
  }
};

const VOUCHER_SIZES: VoucherSize[] = ['short', 'tall', 'grande', 'venti', 'trenta'];

export function calculateVoucherRequirement(distanceKm: number, vehicleType: VehicleType | string): VoucherSize {
  // Normalize vehicle type to our supported types
  const normalizedVehicleType = normalizeVehicleType(vehicleType);
  
  // Find the smallest voucher size that covers the distance
  for (const size of VOUCHER_SIZES) {
    if (distanceKm <= VOUCHER_MATRIX[normalizedVehicleType][size]) {
      return size;
    }
  }
  
  // If distance exceeds all voucher sizes, return the largest
  return 'trenta';
}

export function getVoucherDistance(voucherSize: VoucherSize, vehicleType: VehicleType): number {
  const normalizedVehicleType = normalizeVehicleType(vehicleType);
  return VOUCHER_MATRIX[normalizedVehicleType][voucherSize];
}

export function getAllVoucherSizes(): VoucherSize[] {
  return [...VOUCHER_SIZES];
}

function normalizeVehicleType(vehicleType: VehicleType | string): VehicleType {
  const type = vehicleType.toLowerCase();
  
  switch (type) {
    case 'motorcycle':
      return 'Motorcycle';
    case 'car':
      return 'Car';
    case 'suv':
      return 'SUV';
    case 'truck':
      return 'Truck';
    case 'bicycle':
      return 'Bicycle';
    case 'scooter':
      return 'Scooter';
    default:
      return 'Car'; // Default fallback
  }
}

export function formatVoucherSize(size: VoucherSize): string {
  return size.charAt(0).toUpperCase() + size.slice(1);
}

export function getVoucherDescription(size: VoucherSize, vehicleType: VehicleType): string {
  const distance = getVoucherDistance(size, vehicleType);
  return `${formatVoucherSize(size)} (up to ${distance}km for ${vehicleType})`;
}
