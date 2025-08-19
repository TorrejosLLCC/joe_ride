import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../UI/Input";
import { Button } from "../UI/Button";
import { useRides } from "../../store/rides-context";
import { useVoucher } from "../../store/voucher-context";
import { useUser } from "../../store/user-context";
import { type VehicleType } from "../../utils/voucherCalculator";

interface RideRequestFormData {
  origin: string;
  destination: string;
  preferredDepartureTime: string;
  distanceKm: number;
  preferredVehicleType: VehicleType;
}

export const RideRequestForm: FC = () => {
  const navigate = useNavigate();
  const { createRequest } = useRides();
  const { calculateVoucherForTrip } = useVoucher();
  const { user } = useUser();

  const [formData, setFormData] = useState<RideRequestFormData>({
    origin: "",
    destination: "",
    preferredDepartureTime: "",
    distanceKm: 0,
    preferredVehicleType: "sedan",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof RideRequestFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError("You must be logged in to request a ride");
      return;
    }

    if (!formData.origin || !formData.destination || !formData.preferredDepartureTime) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.distanceKm <= 0) {
      setError("Please enter a valid distance");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const voucherInfo = calculateVoucherForTrip(formData.distanceKm, formData.preferredVehicleType);
      
      await createRequest({
        userId: user.id,
        origin: formData.origin,
        destination: formData.destination,
        preferredDepartureTime: formData.preferredDepartureTime,
        distanceKm: formData.distanceKm,
        voucherOffered: voucherInfo.size,
      });

      // Reset form and navigate to ride board
      setFormData({
        origin: "",
        destination: "",
        preferredDepartureTime: "",
        distanceKm: 0,
        preferredVehicleType: "sedan",
      });

      navigate("/rideboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create ride request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const voucherInfo = formData.distanceKm > 0 
    ? calculateVoucherForTrip(formData.distanceKm, formData.preferredVehicleType)
    : null;

  return (
    <div className="ride-request-form">
      <h2>Request a Ride</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <Input
          label="From"
          placeholder="Starting location"
          value={formData.origin}
          onChange={(e) => handleInputChange("origin", e.target.value)}
        />
        
        <Input
          label="To"
          placeholder="Destination"
          value={formData.destination}
          onChange={(e) => handleInputChange("destination", e.target.value)}
        />
        
        <Input
          label="Preferred Departure Time"
          type="datetime-local"
          value={formData.preferredDepartureTime}
          onChange={(e) => handleInputChange("preferredDepartureTime", e.target.value)}
        />
        
        <Input
          label="Distance (KM)"
          type="number"
          placeholder="Enter trip distance in kilometers"
          value={formData.distanceKm.toString()}
          onChange={(e) => handleInputChange("distanceKm", parseInt(e.target.value) || 0)}
        />
        
        <div className="input-group">
          <label className="input-label">Preferred Vehicle Type</label>
          <select 
            value={formData.preferredVehicleType}
            onChange={(e) => handleInputChange("preferredVehicleType", e.target.value as VehicleType)}
            className="input-field"
          >
            <option value="motorcycle">Motorcycle</option>
            <option value="sedan">Sedan</option>
            <option value="compact">Compact</option>
            <option value="suv">SUV</option>
            <option value="pickup">Pickup</option>
          </select>
        </div>
        
        {voucherInfo && (
          <div className="voucher-preview">
            <h3>Voucher Offering</h3>
            <p>Willing to offer: <strong>{voucherInfo.size}</strong> coffee voucher</p>
            <p className="voucher-description">{voucherInfo.description}</p>
          </div>
        )}
        
        <div className="form-actions">
          <Button 
            type="submit" 
            disabled={isSubmitting || !user}
          >
            {isSubmitting ? "Creating Request..." : "Request Ride"}
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RideRequestForm;