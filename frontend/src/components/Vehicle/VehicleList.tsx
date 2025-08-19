import { type FC } from "react";
import { useVehicle } from "../../store/vehicle-context";
import { useUser } from "../../store/user-context";
import { Button } from "../UI/Button";
import { Card } from "../UI/Card";

export const VehicleList: FC = () => {
  const { vehicles, activeVehicle, setActiveVehicle, deleteVehicle } = useVehicle();
  const { user } = useUser();

  const userVehicles = vehicles.filter(v => v.userId === user?.id);

  const handleSetActive = (vehicleId: string) => {
    const vehicle = userVehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setActiveVehicle(vehicle);
    }
  };

  const handleDelete = async (vehicleId: string) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await deleteVehicle(vehicleId);
      } catch (error) {
        alert("Failed to delete vehicle. Please try again.");
      }
    }
  };

  if (userVehicles.length === 0) {
    return (
      <Card className="vehicle-list">
        <h3>🚗 Your Vehicles</h3>
        <div className="no-vehicles">
          <p>No vehicles registered yet.</p>
          <p>Add a vehicle to start offering rides!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="vehicle-list">
      <h3>🚗 Your Vehicles</h3>
      
      <div className="vehicles-grid">
        {userVehicles.map(vehicle => (
          <div 
            key={vehicle.id} 
            className={`vehicle-card ${vehicle.id === activeVehicle?.id ? 'active' : ''}`}
          >
            <div className="vehicle-header">
              <h4>
                {vehicle.make} {vehicle.model} 
                {vehicle.year && ` (${vehicle.year})`}
              </h4>
              {vehicle.id === activeVehicle?.id && (
                <span className="active-badge">Active</span>
              )}
            </div>

            <div className="vehicle-details">
              <div className="detail-row">
                <strong>Type:</strong> {vehicle.type}
              </div>
              <div className="detail-row">
                <strong>Plate:</strong> {vehicle.licensePlate}
              </div>
              {vehicle.color && (
                <div className="detail-row">
                  <strong>Color:</strong> {vehicle.color}
                </div>
              )}
              <div className="detail-row">
                <strong>Seats:</strong> {vehicle.seatCapacity}
              </div>
              <div className="detail-row">
                <strong>Status:</strong> {vehicle.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>

            <div className="vehicle-actions">
              {vehicle.id !== activeVehicle?.id && (
                <Button 
                  size="small"
                  onClick={() => handleSetActive(vehicle.id)}
                >
                  Set Active
                </Button>
              )}
              <Button 
                size="small"
                variant="danger"
                onClick={() => handleDelete(vehicle.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};