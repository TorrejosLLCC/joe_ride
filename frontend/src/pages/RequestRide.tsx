import type { FC } from "react";
import { RideRequestForm } from "../components/Ride/RideRequestForm";
import { useUser } from "../store/user-context";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/UI/Button";

export const RequestRide: FC = () => {
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <div className="request-ride-page">
        <h1>Login Required</h1>
        <p>You must be logged in to request a ride.</p>
        <Button onClick={() => navigate("/")}>
          Go Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="request-ride-page">
      <RideRequestForm />
    </div>
  );
};