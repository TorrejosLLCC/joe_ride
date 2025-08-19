import type { FC } from "react";
import RideRequestForm from "../components/Ride/RideRequestForm";

export const RequestRide: FC = () => {
  return (
    <div className="request-ride-page">
      <h1>Request a Ride</h1>
      <div className="page-notice">
        <p><strong>Notice:</strong> Ride request functionality is currently under development in the backend.</p>
        <p>For now, please check the <a href="/rideboard">Ride Board</a> to find available ride offers, or <a href="/offer-ride">create your own ride offer</a>.</p>
      </div>
      <p>Need a ride? Post your request and connect with drivers going your way!</p>
      <RideRequestForm />
    </div>
  );
};