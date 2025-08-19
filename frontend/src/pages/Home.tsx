import type { FC } from "react";
import { Button } from "../components/UI/Button";
import { useNavigate } from "react-router-dom";
import { useUser } from "../store/user-context";

export const Home: FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();

  const handleOfferRide = () => {
    navigate("/offer-ride");
  }

  const handleRequestRide = () => {
    navigate("/request-ride");
  }

  const handleViewRideBoard = () => {
    navigate("/rideboard");
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>☕ Joe Ride</h1>
        <p className="hero-description">
          Your coffee-powered ride sharing platform where rides are paid with coffee vouchers!
        </p>
      </div>

      {isLoggedIn ? (
        <div className="home-actions">
          <div className="action-section">
            <h2>Share or Find Rides</h2>
            <div className="actions">
              <Button onClick={handleOfferRide}>Offer a Ride</Button>
              <Button onClick={handleRequestRide} variant="secondary">Request a Ride</Button>
            </div>
          </div>

          <div className="action-section">
            <h2>Browse Available Rides</h2>
            <div className="actions">
              <Button onClick={handleViewRideBoard}>View Ride Board</Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="home-guest">
          <h2>Welcome to Joe Ride!</h2>
          <p>Please sign in or register to start offering or requesting rides.</p>
          <div className="actions">
            <Button onClick={handleViewRideBoard}>Browse Rides</Button>
          </div>
        </div>
      )}

      <div className="features-section">
        <h2>How Joe Ride Works</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>🚗 Offer Rides</h3>
            <p>Share your car and help others reach their destination while earning coffee vouchers.</p>
          </div>
          <div className="feature">
            <h3>🙋 Request Rides</h3>
            <p>Need a ride? Post your request and connect with drivers going your way.</p>
          </div>
          <div className="feature">
            <h3>☕ Coffee Vouchers</h3>
            <p>Pay for rides with coffee vouchers instead of cash. The longer the distance, the bigger the voucher!</p>
          </div>
          <div className="feature">
            <h3>🌟 Community</h3>
            <p>Build connections with fellow commuters and create a friendly ride-sharing community.</p>
          </div>
        </div>
      </div>
    </div>
  )
};
