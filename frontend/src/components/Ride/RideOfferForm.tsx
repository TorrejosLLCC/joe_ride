import React, { useState, useEffect } from "react";
import { useRides } from "../../store/rides-context";
import { useUser } from "../../store/user-context";
import { Input } from "../UI/Input";
import { Select } from "../UI/Select";
import { Button } from "../UI/Button";
import type { RideOfferForm as RideOfferFormType, VehicleType } from "../../types";
import { calculateVoucherRequirement, formatVoucherSize } from "../../utils/voucherCalculator";

const RideOfferForm: React.FC = () => {
    const { addOffer, loading } = useRides();
    const { user, isLoggedIn } = useUser();
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<RideOfferFormType>({
        origin: "",
        destination: "",
        departureDate: "",
        departureTime: "",
        vehicleType: "Car", // This will be updated in useEffect
        seatCapacity: 1,
        distanceKm: 0,
    });

    // Add this helper function in your RideOfferForm
    const mapBackendToFrontendVehicleType = (backendType: string): VehicleType => {
        switch (backendType?.toLowerCase()) {
          case 'sedan':
            return 'Car';
          case 'suv':
            return 'SUV';
          case 'motorcycle':
            return 'Motorcycle';
          case 'pickup':
            return 'Truck';
          default:
            return 'Car';
        }
      };

    // Then in your useEffect:
    useEffect(() => {
        if (user?.vehicleType) {
        setFormData(prev => ({
            ...prev,
            vehicleType: mapBackendToFrontendVehicleType(user.vehicleType!)
        }));
        }
    }, [user]);

    // // Handle input changes
    // const handleChange = (
    //     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    // ) => {
    //     const { name, value } = e.target;
    //     setFormData((prev) => ({
    //         ...prev,
    //         [name]: name === "seatCapacity" || name === "distanceKm" ? Number(value) : value,
    //     }));
    // };

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
                vehicleType: "Car",
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

                {/* <div className="input-group">
                    <label className="input-label">Vehicle Type</label>
                    <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        className="input-field"
                    >
                        <option value="Car">Car</option>
                        <option value="Motorcycle">Motorcycle</option>
                        <option value="SUV">SUV</option>
                        <option value="Truck">Truck</option>
                        <option value="Bicycle">Bicycle</option>
                        <option value="Scooter">Scooter</option>
                    </select>
                </div> */}

                <Select
                    label="Vehicle Type"
                    value={formData.vehicleType}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicleType: e.target.value as VehicleType }))}
                    options={[
                        { value: "Car", label: "Car" },
                        { value: "Motorcycle", label: "Motorcycle" },
                        { value: "SUV", label: "SUV" },
                        { value: "Truck", label: "Truck" },
                        { value: "Bicycle", label: "Bicycle" },
                        { value: "Scooter", label: "Scooter" },
                    ]}
                    placeholder="Select vehicle type..."
                    required={true}
                />

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

