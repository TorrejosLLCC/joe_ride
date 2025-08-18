import type { FC } from "react";
import RideRequestForm from "../components/Ride/RideRequestForm";

export const RequestRide: FC = () => {
  return (
    <div className="request-ride-page">
      <h1>Request a Ride</h1>
      <p>Create a new ride request</p>
      {/* RideRequestForm component will be implemented later */}
      <RideRequestForm />
    </div>
  );
};