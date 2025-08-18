import type { FC } from "react";
import { Button } from "../UI/Button";

import { useNavigate } from "react-router-dom";

const RideOfferForm: FC = () => {
    const navigate = useNavigate();

    const handleOfferRide = () => {
        navigate("/offer-ride");
    }

    return (
        <div className="ride-offer-form-page">
            <form>
                <div className="form-group">
                    <label htmlFor="pickupLocation">Departure Location</label>
                    <input type="text" id="pickupLocation" name="pickupLocation" />
                </div>
                <div className="form-group">
                    <label htmlFor="dropoffLocation">Arrival  Location</label>
                    <input type="text" id="dropoffLocation" name="dropoffLocation" />
                </div>
                <div className="form-group">
                    <label htmlFor="departureTime">Departure Time</label>
                    <input type="datetime-local" id="departureTime" name="departureTime" />
                </div>
                <div className="form-group">
                    <label htmlFor="arrivalTime">Arrival Time</label>
                    <input type="datetime-local" id="arrivalTime" name="arrivalTime" />
                </div>
                <div className="form-group">
                    <label htmlFor="vehicleType">Vehicle Type</label>
                    <select id="vehicleType" name="vehicleType">
                        <option value="car">Car</option>
                        <option value="van">Van</option>
                        <option value="bus">Bus</option>
                        <option value="motorcycle">Motorcycle</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="seatsAvailable">Seats Available</label>
                    <input type="number" id="seatsAvailable" name="seatsAvailable" />
                </div>
            </form>
            <Button onClick={handleOfferRide}>Submit</Button>
        </div>
    );
};
export default RideOfferForm;

