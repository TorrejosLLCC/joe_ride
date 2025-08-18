import type { FC } from "react";
import { Button } from "../components/UI/Button";
import { useNavigate } from "react-router-dom";

export const Home: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <h1>Joe Ride</h1>
      <p>Your coffee-powered ride sharing platform</p>
      <div className="actions">
        <Button onClick={() => navigate("/offer-ride")}>Offer a Ride</Button>
        <Button onClick={() => navigate("/request-ride")} variant="secondary">Request a Ride</Button>
      </div>
    </div>
  )
};
