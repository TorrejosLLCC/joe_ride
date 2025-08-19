import { useState, type FC } from "react";
import { Input } from "../UI/Input";
import { Button } from "../UI/Button";
import { Card } from "../UI/Card";
import { useVehicle } from "../../store/vehicle-context";
import { type VehicleType } from "../../utils/voucherCalculator";

interface VehicleFormProps {
  onSubmit?: () => void;
}

export const VehicleForm: FC<VehicleFormProps> = ({ onSubmit }) => {
  const { addVehicle } = useVehicle();
  
  const [formData, setFormData] = useState({
    type: "sedan" as VehicleType,
    licensePlate: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    seatCapacity: 4,
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.licensePlate.trim()) {
      setError("License plate is required");
      return;
    }

    if (formData.seatCapacity < 1 || formData.seatCapacity > 8) {
      setError("Seat capacity must be between 1 and 8");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await addVehicle(formData);
      
      // Reset form
      setFormData({
        type: "sedan" as VehicleType,
        licensePlate: "",
        make: "",
        model: "",
        year: new Date().getFullYear(),
        color: "",
        seatCapacity: 4,
        isActive: true,
      });

      onSubmit?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add vehicle");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="vehicle-form">
      <h3>🚗 Add New Vehicle</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label">Vehicle Type</label>
          <select 
            value={formData.type}
            onChange={(e) => handleInputChange("type", e.target.value as VehicleType)}
            className="input-field"
          >
            <option value="motorcycle">Motorcycle</option>
            <option value="sedan">Sedan</option>
            <option value="compact">Compact</option>
            <option value="suv">SUV</option>
            <option value="pickup">Pickup</option>
          </select>
        </div>

        <Input
          label="License Plate"
          placeholder="ABC-123"
          value={formData.licensePlate}
          onChange={(e) => handleInputChange("licensePlate", e.target.value)}
          required
        />

        <Input
          label="Make"
          placeholder="Toyota, Honda, etc."
          value={formData.make}
          onChange={(e) => handleInputChange("make", e.target.value)}
        />

        <Input
          label="Model"
          placeholder="Camry, Civic, etc."
          value={formData.model}
          onChange={(e) => handleInputChange("model", e.target.value)}
        />

        <Input
          label="Year"
          type="number"
          min="1990"
          max={new Date().getFullYear().toString()}
          value={formData.year.toString()}
          onChange={(e) => handleInputChange("year", parseInt(e.target.value) || new Date().getFullYear())}
        />

        <Input
          label="Color"
          placeholder="Red, Blue, White, etc."
          value={formData.color}
          onChange={(e) => handleInputChange("color", e.target.value)}
        />

        <Input
          label="Seat Capacity"
          type="number"
          min="1"
          max="8"
          value={formData.seatCapacity.toString()}
          onChange={(e) => handleInputChange("seatCapacity", parseInt(e.target.value) || 4)}
          required
        />

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleInputChange("isActive", e.target.checked)}
            />
            Set as active vehicle
          </label>
        </div>

        <div className="form-actions">
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding Vehicle..." : "Add Vehicle"}
          </Button>
        </div>
      </form>
    </Card>
  );
};