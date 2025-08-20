import React, { useState, useMemo } from "react";
import { useRides } from "../../store/rides-context";
import { RideList } from "../Ride/RideList";
import { RideFilter } from "./RideFilter";
import { Button } from "../UI/Button";
import type { RideBoardFilters } from "../../types";

export const RideBoard: React.FC = () => {
  const { offers, requests, loading, error, fetchAllRides, joinRide } = useRides();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<RideBoardFilters>({
    rideType: 'both'
  });

  // Filter rides based on current filters
  const filteredOffers = useMemo(() => {
    if (!offers) return [];
    
    return offers.filter(offer => {
      // Date filter
      if (filters.date) {
        const offerDate = new Date(offer.departureDateTime).toDateString();
        const filterDate = new Date(filters.date).toDateString();
        if (offerDate !== filterDate) return false;
      }

      // Time filters
      if (filters.timeFrom || filters.timeTo) {
        const offerTime = new Date(offer.departureDateTime).toTimeString().slice(0, 5);
        if (filters.timeFrom && offerTime < filters.timeFrom) return false;
        if (filters.timeTo && offerTime > filters.timeTo) return false;
      }

      // Location filters
      if (filters.origin && !offer.origin.toLowerCase().includes(filters.origin.toLowerCase())) {
        return false;
      }
      if (filters.destination && !offer.destination.toLowerCase().includes(filters.destination.toLowerCase())) {
        return false;
      }

      // Voucher size filter
      if (filters.voucherSize && offer.voucherRequirement !== filters.voucherSize) {
        return false;
      }

      return true;
    });
  }, [offers, filters]);

  const filteredRequests = useMemo(() => {
    if (!requests) return [];
    
    return requests.filter(request => {
      // Date filter (using preferred departure date)
      if (filters.date) {
        const requestDate = new Date(request.preferredDate).toDateString();
        const filterDate = new Date(filters.date).toDateString();
        if (requestDate !== filterDate) return false;
      }

      // Time filters (check if filter time overlaps with request time window)
      if (filters.timeFrom || filters.timeTo) {
        const requestStartTime = request.preferredTimeFrom;
        const requestEndTime = request.preferredTimeTo;
        
        if (filters.timeFrom && requestEndTime < filters.timeFrom) return false;
        if (filters.timeTo && requestStartTime > filters.timeTo) return false;
      }

      // Location filters
      if (filters.origin && !request.origin.toLowerCase().includes(filters.origin.toLowerCase())) {
        return false;
      }
      if (filters.destination && !request.destination.toLowerCase().includes(filters.destination.toLowerCase())) {
        return false;
      }

      // Voucher size filter
      if (filters.voucherSize && request.voucherRequirement !== filters.voucherSize) {
        return false;
      }

      return true;
    });
  }, [requests, filters]);

  const handleJoinRide = async (rideId: string) => {
    try {
      await joinRide(rideId);
      alert("Successfully joined the ride!");
    } catch (err: any) {
      alert(err.message || "Failed to join ride");
    }
  };

  const handleContactForRequest = (_requestId: string) => {
    // TODO: Implement contact functionality
    alert("Contact functionality coming soon!");
  };

  const clearFilters = () => {
    setFilters({ rideType: 'both' });
  };

  const showOffersOnly = filters.rideType === 'offers' || filters.rideType === 'both';
  const showRequestsOnly = filters.rideType === 'requests' || filters.rideType === 'both';

  if (loading && (!offers.length && !requests.length)) {
    return <div className="loading">Loading rides...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Error loading rides: {error}</p>
        <Button onClick={fetchAllRides}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="ride-board">
      <div className="ride-board-header">
        <h2>Ride Board</h2>
        <div className="board-actions">
          <Button 
            onClick={() => setShowFilters(!showFilters)}
            variant="secondary"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button onClick={fetchAllRides} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>
 
      {showFilters && (
        <RideFilter
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
        />
      )}

      <div className="ride-board-content">
        {!loading && offers.length === 0 && requests.length === 0 && (
          <div className="ride-board-info">
            <h3>Welcome to the Ride Board!</h3>
            <p>This is where you can find ride offers and requests from other users.</p>
            <p><strong>Note:</strong> Ride requests are not yet implemented in the backend. For now, you can only view and create ride offers.</p>
            <div className="info-actions">
              <Button onClick={() => window.location.href = '/offer-ride'}>
                Create Your First Ride Offer
              </Button>
            </div>
          </div>
        )}
        
        <RideList
          offers={filteredOffers}
          requests={filteredRequests}
          onJoinRide={handleJoinRide}
          onContactForRequest={handleContactForRequest}
          showOffers={showOffersOnly}
          showRequests={showRequestsOnly}
        />
      </div>
    </div>
  );
};