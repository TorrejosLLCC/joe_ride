import React, { useState } from "react";
import { useRides } from "../../store/rides-context";
import { useUser } from "../../store/user-context";
import { Input } from "../UI/Input";
import { Button } from "../UI/Button";
import type { RideOfferForm as RideOfferFormType, VehicleType } from "../../types";
import { calculateVoucherRequirement, formatVoucherSize } from "../../utils/voucherCalculator";

const RideOfferForm: React.FC = () => {
    const { addOffer, loading } = useRides();
    const { isLoggedIn } = useUser();
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<RideOfferFormType>({
        origin: "",
        destination: "",
        departureDate: "",
        departureTime: "",
        vehicleType: "sedan",
        seatCapacity: 1,
        distanceKm: 0,
    });

    // Handle input changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "seatCapacity" || name === "distanceKm" ? Number(value) : value,
        }));
    };

    // Calculate voucher requirement for preview
    const voucherRequirement = formData.distanceKm > 0 && formData.vehicleType 
        ? calculateVoucherRequirement(formData.distanceKm, formData.vehicleType as VehicleType)
        : null;

    // Submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isLoggedIn) {
            setError("Please log in to offer a ride");
            return;
        }

        try {
            setError(null);
            await addOffer(formData);
            
            // Reset form on success
            setFormData({
                origin: "",
                destination: "",
                departureDate: "",
                departureTime: "",
                vehicleType: "sedan",
                seatCapacity: 1,
                distanceKm: 0,
            });
            
            alert("Ride offer created successfully!");
        } catch (err: any) {
            setError(err.message || "Failed to create ride offer");
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="offer-ride-form">
                <p>Please log in to offer a ride</p>
            </div>
        );
    }

    return (
        <div className="offer-ride-form">
            <h2>Offer a Ride</h2>
            
            <form onSubmit={handleSubmit}>
                <Input
                    label="From"
                    placeholder="Starting location"
                    value={formData.origin}
                    onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                />

                <Input
                    label="To"
                    placeholder="Destination"
                    value={formData.destination}
                    onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                />

                <Input
                    label="Departure Date"
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, departureDate: e.target.value }))}
                />

                <Input
                    label="Departure Time"
                    type="time"
                    value={formData.departureTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, departureTime: e.target.value }))}
                />

                <div className="input-group">
                    <label className="input-label">Vehicle Type</label>
                    <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        className="input-field"
                    >
                        <option value="motorcycle">Motorcycle</option>
                        <option value="sedan">Sedan/Car</option>
                        <option value="compact">Compact/Hatchback</option>
                        <option value="suv">SUV/Van</option>
                        <option value="pickup">Pickup/Truck</option>
                    </select>
                </div>

                <Input
                    label="Seat Capacity"
                    type="number"
                    placeholder="Number of available seats"
                    value={formData.seatCapacity.toString()}
                    onChange={(e) => setFormData(prev => ({ ...prev, seatCapacity: Number(e.target.value) }))}
                />

                <Input
                    label="Distance (KM)"
                    type="number"
                    placeholder="Distance in kilometers"
                    value={formData.distanceKm.toString()}
                    onChange={(e) => setFormData(prev => ({ ...prev, distanceKm: Number(e.target.value) }))}
                />

                {voucherRequirement && (
                    <div className="voucher-preview">
                        <p>Voucher Required: <strong>{formatVoucherSize(voucherRequirement)}</strong></p>
                    </div>
                )}

                {error && <div className="form-error">{error}</div>}

                <div className="form-actions">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Offer Ride"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default RideOfferForm;

