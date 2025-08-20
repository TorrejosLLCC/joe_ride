import type { FC } from "react";
import RideOfferForm from "../components/Ride/RideOfferForm";

export const OfferRide: FC = () => {
  return (
    <div className="offer-ride-page">
      <h1>Offer a Ride</h1>
      <p>Share your ride and help others get to their destination while earning coffee vouchers!</p>
      <RideOfferForm />
    </div>
  );
};
