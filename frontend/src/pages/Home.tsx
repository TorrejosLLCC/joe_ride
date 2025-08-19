import type { FC } from "react";
import { Button } from "../components/UI/Button";
import { useNavigate } from "react-router-dom";
import { useUser } from "../store/user-context";

export const Home: FC = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, canOfferRides } = useUser();

  const handleOfferRide = () => {
    if (!isLoggedIn) {
      alert("Please login to offer a ride");
      return;
    }
    if (!canOfferRides) {
      alert("You need a valid driver's license and registered vehicle to offer rides");
      navigate("/profile");
      return;
    }
    navigate("/offer-ride");
  };

  const handleRequestRide = () => {
    if (!isLoggedIn) {
      alert("Please login to request a ride");
      return;
    }
    navigate("/request-ride");
  };

  const handleViewRideBoard = () => {
    navigate("/rideboard");
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>☕ Joe Ride</h1>
        <p className="tagline">Your coffee-powered ride sharing platform</p>
        <p className="description">
          Join rides, offer rides, and pay with coffee vouchers! 
          Switch between being a driver and passenger based on your needs.
        </p>
      </div>

      <div className="features-section">
        <div className="feature">
          <h3>🚗 Flexible Roles</h3>
          <p>Be a driver today, passenger tomorrow</p>
        </div>
        <div className="feature">
          <h3>☕ Coffee Vouchers</h3>
          <p>Pay with real coffee vouchers instead of digital money</p>
        </div>
        <div className="feature">
          <h3>🤝 Community Driven</h3>
          <p>Build connections with fellow commuters</p>
        </div>
      </div>

      <div className="actions-section">
        {isLoggedIn ? (
          <>
            <div className="welcome-message">
              <p>Welcome back, {user?.name}! What would you like to do?</p>
            </div>
            <div className="action-buttons">
              {canOfferRides && (
                <Button onClick={handleOfferRide} size="large">
                  Offer a Ride
                </Button>
              )}
              <Button onClick={handleRequestRide} variant={canOfferRides ? "secondary" : "primary"} size="large">
                Request a Ride
              </Button>
              <Button onClick={handleViewRideBoard} variant="secondary" size="large">
                View Ride Board
              </Button>
              {!canOfferRides && (
                <div className="offer-ride-info">
                  <p>
                    💡 <strong>Want to offer rides?</strong><br/>
                    Complete your profile with a driver's license and vehicle information!
                  </p>
                  <Button onClick={() => navigate("/profile")} variant="secondary" size="small">
                    Complete Profile
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="login-prompt">
              <p>Login or register to start sharing rides!</p>
            </div>
            <div className="action-buttons">
              <Button onClick={handleViewRideBoard} size="large">
                Browse Rides
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="info-section">
        <h2>How Joe Ride Works</h2>
        <div className="steps">
          <div className="step">
            <h4>1. Create Your Account</h4>
            <p>Register with your details and vehicle information (if you plan to offer rides)</p>
          </div>
          <div className="step">
            <h4>2. Post or Find Rides</h4>
            <p>Offer rides when you're driving or request rides when you need them</p>
          </div>
          <div className="step">
            <h4>3. Connect & Travel</h4>
            <p>Join rides and pay with coffee vouchers based on distance and vehicle type</p>
          </div>
        </div>
      </div>
    </div>
  );
};
