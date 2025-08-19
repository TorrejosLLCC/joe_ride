import React, { useState } from "react";
import { useRides } from "../../store/rides-context";

const RideOfferForm: React.FC = () => {
    const { addOffer } = useRides();


    const [formData, setFormData] = useState({
        fromLocation: "",
        toLocation: "",
        departureDate: "",
        departureTime: "",
        capacity: 1,
        vehicleType: "",
        kilometerCount: 0,
    });

    // handle input changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "capacity" || name === "kilometerCount" ? Number(value) : value,
        }));
    };

    // submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload = {
                fromLocation: formData.fromLocation,
                toLocation: formData.toLocation,
                departure: `${formData.departureDate}T${formData.departureTime}`,
                departureTime: formData.departureTime,
                capacity: formData.capacity,
                vehicleType: formData.vehicleType,
                distanceKm: formData.kilometerCount,
            };
            await addOffer(payload); // send data to backend
            // alert("Ride offer created successfully!");
            setFormData({
                fromLocation: "",
                toLocation: "",
                departureDate: "",
                departureTime: "",
                capacity: 1,
                vehicleType: "",
                kilometerCount: 0,
            });
        } catch (error) {
            console.error("Error creating ride offer:", error);
            alert("Failed to create ride offer.");
        }
    };


    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded space-y-4">
            <h2 className="text-lg font-bold">Offer a Ride</h2>

            <div>
                <label className="block">From</label>
                <input
                    type="text"
                    name="fromLocation"
                    value={formData.fromLocation}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />
            </div>

            <div>
                <label className="block">To</label>
                <input
                    type="text"
                    name="toLocation"
                    value={formData.toLocation}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />
            </div>

            <div>
                <label className="block">Departure Date</label>
                <input
                    type="date"
                    name="departureDate"
                    value={formData.departureDate}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />
            </div>

            <div>
                <label className="block">Departure Time</label>
                <input
                    type="time"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />
            </div>

            <div>
                <label className="block">Capacity</label>
                <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    min={1}
                />
            </div>

            <div>
                <label className="block">Vehicle Type</label>
                <input
                    type="text"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </div>

            <div>
                <label className="block">Distance kilometers</label>
                <input
                    type="number"
                    name="kilometerCount"
                    value={formData.kilometerCount}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    min={0}
                />
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Submit Ride Offer
            </button>
        </form>
    );
};

export default RideOfferForm;

