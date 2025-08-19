import type { FC } from "react";
import RideOfferForm from "../components/Ride/RideOfferForm";

export const OfferRide: FC = () => {

  return (
    <div className="offer-ride-page max-w-lg mx-auto p-6 bg-white shadow rounded">
      <RideOfferForm />
    </div>
  );
};
