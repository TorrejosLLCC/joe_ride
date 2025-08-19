import React, { useState } from "react";
import { Input } from "../UI/Input";
import { VoucherDisplay } from "./VoucherDisplay";
import type { VehicleType } from "../../types";
import { calculateVoucherRequirement } from "../../utils/voucherCalculator";

export const VoucherCalculator: React.FC = () => {
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [vehicleType, setVehicleType] = useState<VehicleType>('sedan');

  const voucherSize = distanceKm > 0 ? calculateVoucherRequirement(distanceKm, vehicleType) : null;

  return (
    <div className="voucher-calculator">
      <h3>Calculate Voucher Requirement</h3>
      
      <div className="calculator-inputs">
        <Input
          label="Distance (KM)"
          type="number"
          placeholder="Enter distance in kilometers"
          value={distanceKm.toString()}
          onChange={(e) => setDistanceKm(Number(e.target.value) || 0)}
        />

        <div className="input-group">
          <label className="input-label">Vehicle Type</label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value as VehicleType)}
            className="input-field"
          >
            <option value="motorcycle">Motorcycle</option>
            <option value="sedan">Sedan/Car</option>
            <option value="compact">Compact/Hatchback</option>
            <option value="suv">SUV/Van</option>
            <option value="pickup">Pickup/Truck</option>
          </select>
        </div>
      </div>

      {voucherSize && (
        <div className="calculator-result">
          <h4>Required Voucher:</h4>
          <VoucherDisplay 
            size={voucherSize} 
            vehicleType={vehicleType}
            distanceKm={distanceKm}
          />
        </div>
      )}
    </div>
  );
};