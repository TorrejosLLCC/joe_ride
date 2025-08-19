import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../UI/Input";
import { Button } from "../UI/Button";
import { useRides } from "../../store/rides-context";
import { useVehicle } from "../../store/vehicle-context";
import { useVoucher } from "../../store/voucher-context";
import { useUser } from "../../store/user-context";
import { type VehicleType } from "../../utils/voucherCalculator";

interface RideOfferFormData {
  origin: string;
  destination: string;
  departureDateTime: string;
  vehicleType: VehicleType;
  seatCapacity: number;
  distanceKm: number;
}

export const RideOfferForm: FC = () => {
  const navigate = useNavigate();
  const { createOffer } = useRides();
  const { activeVehicle } = useVehicle();
  const { calculateVoucherForTrip } = useVoucher();
  const { user } = useUser();

  const [formData, setFormData] = useState<RideOfferFormData>({
    origin: "",
    destination: "",
    departureDateTime: "",
    vehicleType: activeVehicle?.type || "sedan",
    seatCapacity: activeVehicle?.seatCapacity || 4,
    distanceKm: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof RideOfferFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError("You must be logged in to offer a ride");
      return;
    }

    if (!formData.origin || !formData.destination || !formData.departureDateTime) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.distanceKm <= 0) {
      setError("Please enter a valid distance");
      return;
    }

    if (formData.seatCapacity <= 0) {
      setError("Please enter a valid seat capacity");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const voucherInfo = calculateVoucherForTrip(formData.distanceKm, formData.vehicleType);
      
      await createOffer({
        userId: user.id,
        origin: formData.origin,
        destination: formData.destination,
        departureDateTime: formData.departureDateTime,
        vehicleType: formData.vehicleType,
        seatCapacity: formData.seatCapacity,
        distanceKm: formData.distanceKm,
        voucherRequired: voucherInfo.size,
      });

      // Reset form and navigate to ride board
      setFormData({
        origin: "",
        destination: "",
        departureDateTime: "",
        vehicleType: activeVehicle?.type || "sedan",
        seatCapacity: activeVehicle?.seatCapacity || 4,
        distanceKm: 0,
      });

      navigate("/rideboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create ride offer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const voucherInfo = formData.distanceKm > 0 
    ? calculateVoucherForTrip(formData.distanceKm, formData.vehicleType)
    : null;

  return (
    <div className="ride-offer-form">
      <h2>Offer a Ride</h2>
      
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
          label="Departure Date & Time"
          type="datetime-local"
          value={formData.departureDateTime}
          onChange={(e) => handleInputChange("departureDateTime", e.target.value)}
        />
        
        <div className="input-group">
          <label className="input-label">Vehicle Type</label>
          <select 
            value={formData.vehicleType}
            onChange={(e) => handleInputChange("vehicleType", e.target.value as VehicleType)}
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
          label="Available Seats"
          type="number"
          value={formData.seatCapacity.toString()}
          onChange={(e) => handleInputChange("seatCapacity", parseInt(e.target.value) || 1)}
        />
        
        <Input
          label="Distance (KM)"
          type="number"
          placeholder="Enter trip distance in kilometers"
          value={formData.distanceKm.toString()}
          onChange={(e) => handleInputChange("distanceKm", parseInt(e.target.value) || 0)}
        />
        
        {voucherInfo && (
          <div className="voucher-preview">
            <h3>Voucher Requirement</h3>
            <p><strong>{voucherInfo.size}</strong> coffee voucher required</p>
            <p className="voucher-description">{voucherInfo.description}</p>
          </div>
        )}
        
        <div className="form-actions">
          <Button 
            type="submit" 
            disabled={isSubmitting || !user}
          >
            {isSubmitting ? "Creating Offer..." : "Offer Ride"}
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

export default RideOfferForm;

