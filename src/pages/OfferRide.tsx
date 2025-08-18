import type { FC } from "react";
import { useState } from "react";

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
      <h1 className="text-2xl font-bold mb-4">Offer a Ride</h1>
      <p className="mb-6 text-gray-600">Create a new ride offer</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Origin */}
        <div>
          <label className="block text-sm font-medium">Origin</label>
          <input
            type="text"
            name="origin"
            value={rideData.origin}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Enter departure location"
            required
          />
        </div>

        {/* Destination */}
        <div>
          <label className="block text-sm font-medium">Destination</label>
          <input
            type="text"
            name="destination"
            value={rideData.destination}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Enter arrival location"
            required
          />
        </div>

        {/* Departure Date */}
        <div>
          <label className="block text-sm font-medium">Departure Date</label>
          <input
            type="date"
            name="departureDate"
            value={rideData.departureDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Departure Time */}
        <div>
          <label className="block text-sm font-medium">Departure Time</label>
          <input
            type="time"
            name="departureTime"
            value={rideData.departureTime}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-medium">Capacity</label>
          <input
            type="number"
            name="capacity"
            min="1"
            max="8"
            value={rideData.capacity}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium">Vehicle Type</label>
          <select
            name="vehicleType"
            value={rideData.vehicleType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="motorcycle">Motorcycle</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="pickup">Pickup</option>
          </select>
        </div>

        {/* Distance */}
        <div>
          <label className="block text-sm font-medium">Distance (km)</label>
          <input
            type="number"
            name="distanceKm"
            value={rideData.distanceKm}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Enter distance in kilometers"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Ride Offer
        </button>
      </form>
    </div>
  );
};
