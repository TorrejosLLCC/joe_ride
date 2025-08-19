import type { FC } from "react";
import { RideOfferForm } from "../components/Ride/RideOfferForm";
import { useUser } from "../store/user-context";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/UI/Button";
import { Card } from "../components/UI/Card";

export const OfferRide: FC = () => {
  const { isLoggedIn, user, canOfferRides } = useUser();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <div className="offer-ride-page">
        <h1>Login Required</h1>
        <p>You must be logged in to offer a ride.</p>
        <Button onClick={() => navigate("/")}>
          Go Back to Home
        </Button>
      </div>
    );
  }

  if (!canOfferRides) {
    const hasLicense = user?.hasValidLicense;
    const hasVehicleInfo = !!(user?.vehicleType && user?.vehiclePlate);

    return (
      <div className="offer-ride-page">
        <Card className="requirements-card">
          <h1>🚫 Cannot Offer Rides</h1>
          <p>To offer rides, you need to meet the following requirements:</p>
          
          <div className="requirements-list">
            <div className={`requirement-item ${hasLicense ? 'completed' : 'pending'}`}>
              {hasLicense ? '✅' : '❌'} Valid Driver's License
              {!hasLicense && (
                <p className="requirement-help">
                  Please update your profile with a valid driver's license number.
                </p>
              )}
            </div>
            
            <div className={`requirement-item ${hasVehicleInfo ? 'completed' : 'pending'}`}>
              {hasVehicleInfo ? '✅' : '❌'} Vehicle Information (Type & Plate)
              {!hasVehicleInfo && (
                <p className="requirement-help">
                  You need to provide vehicle type and plate number to offer rides.
                </p>
              )}
            </div>
          </div>

          <div className="requirement-actions">
            <Button onClick={() => navigate("/profile")}>
              📝 Complete Profile Setup
            </Button>
            <Button onClick={() => navigate("/rideboard")} variant="secondary">
              🔍 Browse Available Rides
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="offer-ride-page">
      <RideOfferForm />
    </div>
  );
};
