import type { FC } from "react";
import { useState } from "react";
import RideOfferForm from "../components/Ride/RideOfferForm";

export const OfferRide: FC = () => {
  const [rideData, setRideData] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    departureTime: "",
    capacity: 1,
    vehicleType: "sedan",
    distanceKm: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRideData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Ride Offer Created:", rideData);

    // send this data to your backend API
  };

  return (
    <div className="offer-ride-page max-w-lg mx-auto p-6 bg-white shadow rounded">
      <RideOfferForm />
    </div>
  );
};
