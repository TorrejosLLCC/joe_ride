import React, { useState } from "react";
import { useRides } from "../../store/rides-context";
import { useUser } from "../../store/user-context";
import { Input } from "../UI/Input";
import { Button } from "../UI/Button";
import type { RideRequestForm as RideRequestFormType } from "../../types";
import { calculateVoucherRequirement, formatVoucherSize } from "../../utils/voucherCalculator";

const RideRequestForm: React.FC = () => {
    const { addRequest, loading } = useRides();
    const { isLoggedIn } = useUser();
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<RideRequestFormType>({
        origin: "",
        destination: "",
        preferredDepartureDate: "",
        preferredDepartureTimeStart: "",
        preferredDepartureTimeEnd: "",
        distanceKm: 0,
    });

    // Calculate voucher requirement for preview
    const voucherRequirement = formData.distanceKm > 0 
        ? calculateVoucherRequirement(formData.distanceKm, 'sedan') // Default to sedan for requests
        : null;

    // Submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isLoggedIn) {
            setError("Please log in to request a ride");
            return;
        }

        try {
            setError(null);
            await addRequest(formData);
            
            // Reset form on success
            setFormData({
                origin: "",
                destination: "",
                preferredDepartureDate: "",
                preferredDepartureTimeStart: "",
                preferredDepartureTimeEnd: "",
                distanceKm: 0,
            });
            
            alert("Ride request created successfully!");
        } catch (err: any) {
            setError(err.message || "Failed to create ride request");
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="request-ride-form">
                <p>Please log in to request a ride</p>
            </div>
        );
    }

    return (
        <div className="request-ride-form">
            <h2>Request a Ride</h2>
            
            <form onSubmit={handleSubmit}>
                <Input
                    label="From"
                    placeholder="Pickup location"
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
                    label="Preferred Date"
                    type="date"
                    value={formData.preferredDepartureDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredDepartureDate: e.target.value }))}
                />

                <Input
                    label="Preferred Time (From)"
                    type="time"
                    value={formData.preferredDepartureTimeStart}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredDepartureTimeStart: e.target.value }))}
                />

                <Input
                    label="Preferred Time (To)"
                    type="time"
                    value={formData.preferredDepartureTimeEnd}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredDepartureTimeEnd: e.target.value }))}
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
                        {loading ? "Creating..." : "Request Ride"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default RideRequestForm;