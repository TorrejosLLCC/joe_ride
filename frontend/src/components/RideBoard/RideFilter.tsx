import { type FC } from "react";
import { Input } from "../UI/Input";

interface FilterOptions {
  destination: string;
  departureDate: string;
  vehicleType: string;
  showMyRides: boolean;
}

interface RideFilterProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  showVehicleFilter?: boolean;
}

export const RideFilter: FC<RideFilterProps> = ({
  filters,
  onFilterChange,
  showVehicleFilter = true,
}) => {
  return (
    <div className="ride-filter">
      <h3>Filter Rides</h3>
      
      <div className="filter-controls">
        <Input
          label="Destination"
          placeholder="Search by destination"
          value={filters.destination}
          onChange={(e) => onFilterChange({ destination: e.target.value })}
        />
        
        <Input
          label="Departure Date"
          type="date"
          value={filters.departureDate}
          onChange={(e) => onFilterChange({ departureDate: e.target.value })}
        />
        
        {showVehicleFilter && (
          <div className="input-group">
            <label className="input-label">Vehicle Type</label>
            <select 
              value={filters.vehicleType}
              onChange={(e) => onFilterChange({ vehicleType: e.target.value })}
              className="input-field"
            >
              <option value="">All vehicles</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="sedan">Sedan</option>
              <option value="compact">Compact</option>
              <option value="suv">SUV</option>
              <option value="pickup">Pickup</option>
            </select>
          </div>
        )}
        
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.showMyRides}
              onChange={(e) => onFilterChange({ showMyRides: e.target.checked })}
            />
            Show only my rides
          </label>
        </div>
      </div>
    </div>
  );
};