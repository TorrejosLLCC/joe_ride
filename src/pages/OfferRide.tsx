import type { FC } from "react";
import RideOfferForm from "../components/Ride/RideOfferForm";

export const OfferRide: FC = () => {
  return (
    <div className="offer-ride-page">
      <h1>Offer a Ride</h1>
      <p>Create a new ride offer</p>
      {/* RideOfferForm component will be implemented later */}
      <RideOfferForm />
    </div>
  );
};