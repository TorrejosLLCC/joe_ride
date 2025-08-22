import React from "react";
import { Card } from "../UI/Card";
import type { VoucherSize, VehicleType } from "../../types";
import { formatVoucherSize, getVoucherDescription } from "../../utils/voucherCalculator";

interface VoucherDisplayProps {
  size: VoucherSize;
  vehicleType?: VehicleType;
  distanceKm?: number;
  className?: string;
}

export const VoucherDisplay: React.FC<VoucherDisplayProps> = ({
  size,
  vehicleType = 'Car' as VehicleType,
  distanceKm,
  className = ''
}) => {
  return (
    <Card className={`voucher-display ${className}`}>
      <div className="voucher-content">
        <div className="voucher-icon">☕</div>
        <div className="voucher-details">
          <h3 className="voucher-size">{formatVoucherSize(size)}</h3>
          <p className="voucher-description">
            {getVoucherDescription(size, vehicleType)}
          </p>
          {distanceKm && (
            <p className="voucher-distance">
              For {distanceKm}km trip
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};