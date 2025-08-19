export type VehicleType = 'motorcycle' | 'sedan' | 'compact' | 'suv' | 'pickup';
export type VoucherSize = 'Short' | 'Tall' | 'Grande' | 'Venti' | 'Trenta';

interface VoucherThresholds {
  [key: string]: {
    [K in VehicleType]: number;
  };
}

// Voucher requirement thresholds from specification
const VOUCHER_THRESHOLDS: VoucherThresholds = {
  Short: {
    motorcycle: 5,
    sedan: 3,
    compact: 3,
    suv: 2,
    pickup: 2,
  },
  Tall: {
    motorcycle: 8,
    sedan: 5,
    compact: 5,
    suv: 3,
    pickup: 3,
  },
  Grande: {
    motorcycle: 12,
    sedan: 9,
    compact: 9,
    suv: 5,
    pickup: 5,
  },
  Venti: {
    motorcycle: 18,
    sedan: 14,
    compact: 14,
    suv: 10,
    pickup: 10,
  },
  Trenta: {
    motorcycle: 24,
    sedan: 18,
    compact: 18,
    suv: 14,
    pickup: 14,
  },
};

export function calculateVoucherRequirement(
  distanceKm: number,
  vehicleType: VehicleType
): { size: VoucherSize; description: string } {
  const voucherSizes: VoucherSize[] = ['Short', 'Tall', 'Grande', 'Venti', 'Trenta'];
  
  for (const size of voucherSizes) {
    const threshold = VOUCHER_THRESHOLDS[size][vehicleType];
    if (distanceKm <= threshold) {
      return {
        size,
        description: `${size} coffee voucher required for ${distanceKm}km trip with ${vehicleType}`,
      };
    }
  }
  
  // If distance exceeds Trenta threshold, still return Trenta
  return {
    size: 'Trenta',
    description: `Trenta coffee voucher required for ${distanceKm}km trip with ${vehicleType}`,
  };
}

export function getVoucherThresholds(vehicleType: VehicleType) {
  return Object.entries(VOUCHER_THRESHOLDS).map(([size, thresholds]) => ({
    size: size as VoucherSize,
    maxDistance: thresholds[vehicleType],
  }));
}