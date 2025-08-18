import type { FC } from "react";
import { Button } from "../UI/Button";
import { useNavigate } from "react-router-dom";

const RideRequestForm: FC = () => {
    const navigate = useNavigate();

    const handleRequestRide = () => {
        navigate("/request-ride");
    }

    return (
        <div className="ride-request-form-page">
            <form>
                <div className="form-group">
                    <label htmlFor="pickupLocation">Departure Location</label>
                    <input type="text" id="pickupLocation" name="pickupLocation" />
                </div>
                <div className="form-group">
                    <label htmlFor="dropoffLocation">Arrival Location</label>
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
                <Button onClick={handleRequestRide}>Request a Ride</Button>
            </form>
        </div>
    )
};

export default RideRequestForm;