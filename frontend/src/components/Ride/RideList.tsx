import React from "react";
import { useRides } from "../../store/rides-context";

const RideList: React.FC = () => {
    const { offers } = useRides();

    return (
        <div>
            <h2 className="font-bold text-lg mb-2">Available Ride Offers</h2>
            {offers.length === 0 ? (
                <p>No rides available.</p>
            ) : (
                <ul className="space-y-2">
                    {offers.map((ride) => (
                        <li key={ride.id} className="p-3 border rounded">
                            <p><strong>Driver:</strong> {ride.driverId}</p>
                            <p><strong>From:</strong> {ride.fromLocation}</p>
                            <p><strong>To:</strong> {ride.toLocation}</p>
                            <p><strong>Departure:</strong> {new Date(ride.departureTime).toLocaleString()}</p>
                            <p><strong>Seats Available:</strong> {ride.availableSeats}</p>
                            <p><strong>Vehicle:</strong> {ride.vehicleType}</p>
                            <p><strong>Distance:</strong> {ride.distanceKm} km</p>
                            <p><strong>Capacity:</strong> {ride.capacity}</p>
                            <p><strong>Price:</strong> ${ride.pricePerSeat}</p>
                            <p><strong>Status:</strong> {ride.status}</p>
                            <p><strong>Voucher Required:</strong> {ride.voucherRequired ? "Yes" : "No"}</p>
                            <button>Join Ride</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RideList;
