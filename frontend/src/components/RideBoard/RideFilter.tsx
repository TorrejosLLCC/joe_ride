import React from "react";
import { Input } from "../UI/Input";
import { Button } from "../UI/Button";
import type { RideBoardFilters } from "../../types";
import { getAllVoucherSizes, formatVoucherSize } from "../../utils/voucherCalculator";

interface RideFilterProps {
  filters: RideBoardFilters;
  onFiltersChange: (filters: RideBoardFilters) => void;
  onClearFilters: () => void;
}

export const RideFilter: React.FC<RideFilterProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const voucherSizes = getAllVoucherSizes();

  const handleFilterChange = (key: keyof RideBoardFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== 'both'
  );

  return (
    <div className="ride-filter">
      <h3>Filter Rides</h3>
      
      <div className="filter-grid">
        <div className="filter-group">
          <Input
            label="Date"
            type="date"
            value={filters.date || ''}
            onChange={(e) => handleFilterChange('date', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Input
            label="Time From"
            type="time"
            value={filters.timeFrom || ''}
            onChange={(e) => handleFilterChange('timeFrom', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Input
            label="Time To"
            type="time"
            value={filters.timeTo || ''}
            onChange={(e) => handleFilterChange('timeTo', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Input
            label="Origin"
            placeholder="Starting location"
            value={filters.origin || ''}
            onChange={(e) => handleFilterChange('origin', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Input
            label="Destination"
            placeholder="Destination"
            value={filters.destination || ''}
            onChange={(e) => handleFilterChange('destination', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="input-group">
            <label className="input-label">Voucher Size</label>
            <select
              value={filters.voucherSize || ''}
              onChange={(e) => handleFilterChange('voucherSize', e.target.value)}
              className="input-field"
            >
              <option value="">Any size</option>
              {voucherSizes.map(size => (
                <option key={size} value={size}>
                  {formatVoucherSize(size)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-group">
          <div className="input-group">
            <label className="input-label">Ride Type</label>
            <select
              value={filters.rideType || 'both'}
              onChange={(e) => handleFilterChange('rideType', e.target.value)}
              className="input-field"
            >
              <option value="both">Both Offers & Requests</option>
              <option value="offers">Offers Only</option>
              <option value="requests">Requests Only</option>
            </select>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="filter-actions">
          <Button onClick={onClearFilters} variant="secondary">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};