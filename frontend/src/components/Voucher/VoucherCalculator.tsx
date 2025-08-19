import { useState, type FC } from "react";
import { Input } from "../UI/Input";
import { Card } from "../UI/Card";
import { calculateVoucherRequirement, getVoucherThresholds, type VehicleType } from "../../utils/voucherCalculator";

export const VoucherCalculator: FC = () => {
  const [distance, setDistance] = useState<number>(0);
  const [vehicleType, setVehicleType] = useState<VehicleType>("sedan");

  const voucherInfo = distance > 0 ? calculateVoucherRequirement(distance, vehicleType) : null;
  const thresholds = getVoucherThresholds(vehicleType);

  return (
    <Card className="voucher-calculator">
      <h3>☕ Voucher Calculator</h3>
      <p>Calculate the coffee voucher requirement for your trip</p>

      <div className="calculator-inputs">
        <Input
          label="Distance (KM)"
          type="number"
          value={distance.toString()}
          onChange={(e) => setDistance(parseInt(e.target.value) || 0)}
          placeholder="Enter distance in kilometers"
          min="1"
        />

        <div className="input-group">
          <label className="input-label">Vehicle Type</label>
          <select 
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value as VehicleType)}
            className="input-field"
          >
            <option value="motorcycle">Motorcycle</option>
            <option value="sedan">Sedan</option>
            <option value="compact">Compact</option>
            <option value="suv">SUV</option>
            <option value="pickup">Pickup</option>
          </select>
        </div>
      </div>

      {voucherInfo && (
        <div className="voucher-result">
          <h4>Result</h4>
          <div className="result-highlight">
            <strong>{voucherInfo.size}</strong> coffee voucher required
          </div>
          <p className="result-description">{voucherInfo.description}</p>
        </div>
      )}

      <div className="voucher-thresholds">
        <h4>Voucher Thresholds for {vehicleType}</h4>
        <div className="threshold-list">
          {thresholds.map(({ size, maxDistance }) => (
            <div key={size} className="threshold-item">
              <span className="threshold-size">{size}:</span>
              <span className="threshold-distance">up to {maxDistance} km</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};