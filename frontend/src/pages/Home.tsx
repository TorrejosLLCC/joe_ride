import type { FC } from "react";
import { Button } from "../components/UI/Button";
import { useNavigate } from "react-router-dom";

export const Home: FC = () => {
  const navigate = useNavigate();

  const handleOfferRide = () => {
    navigate("/offer-ride");
  }

  const handleRequestRide = () => {
    navigate("/request-ride");
  }

  const handleRideBoard = () => {
    navigate("/rideboard");
  }

  return (
    <div className="home-page">
      <h1>Joe Ride</h1>
      <p>Your coffee-powered ride sharing platform</p>
      <div className="actions">
        <Button onClick={handleOfferRide}>Offer a Ride</Button>
        <Button onClick={handleRequestRide} variant="secondary">Request a Ride</Button>
        <Button onClick={handleRideBoard}>Ride board</Button>
      </div>
    </div>
  )
};
