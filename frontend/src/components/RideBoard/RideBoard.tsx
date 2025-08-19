import { useState, type FC } from "react";
import { useRides } from "../../store/rides-context";
import { useUser } from "../../store/user-context";
import { RideItem } from "../Ride/RideItem";
import { RideFilter } from "./RideFilter";
import { Button } from "../UI/Button";
import { useNavigate } from "react-router-dom";

interface FilterOptions {
  destination: string;
  departureDate: string;
  vehicleType: string;
  showMyRides: boolean;
}

export const RideBoard: FC = () => {
  const navigate = useNavigate();
  const { offers, requests, loadRides } = useRides();
  const { user, canOfferRides } = useUser();
  
  const [activeTab, setActiveTab] = useState<'offers' | 'requests'>('offers');
  const [filters, setFilters] = useState<FilterOptions>({
    destination: "",
    departureDate: "",
    vehicleType: "",
    showMyRides: false,
  });

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const filterRides = <T extends { destination: string; userId: string; departureDateTime?: string; preferredDepartureTime?: string; vehicleType?: string }>(rides: T[]) => {
    return rides.filter(ride => {
      // Filter by destination
      if (filters.destination && !ride.destination.toLowerCase().includes(filters.destination.toLowerCase())) {
        return false;
      }
      
      // Filter by departure date
      if (filters.departureDate) {
        const rideDate = ride.departureDateTime || ride.preferredDepartureTime;
        if (rideDate && !rideDate.startsWith(filters.departureDate)) {
          return false;
        }
      }
      
      // Filter by vehicle type (only for offers)
      if (filters.vehicleType && 'vehicleType' in ride && ride.vehicleType !== filters.vehicleType) {
        return false;
      }
      
      // Filter my rides
      if (filters.showMyRides && ride.userId !== user?.id) {
        return false;
      }
      
      return true;
    });
  };

  const filteredOffers = filterRides(offers);
  const filteredRequests = filterRides(requests);

  return (
    <div className="ride-board">
      <div className="ride-board-header">
        <h2>Ride Board</h2>
        <div className="ride-board-actions">
          {user && canOfferRides && (
            <Button onClick={() => navigate("/offer-ride")}>
              Offer a Ride
            </Button>
          )}
          <Button onClick={() => navigate("/request-ride")} variant="secondary">
            Request a Ride
          </Button>
          <Button onClick={loadRides} variant="secondary">
            🔄 Refresh
          </Button>
        </div>
      </div>

      <div className="ride-board-tabs">
        <button 
          className={`tab ${activeTab === 'offers' ? 'active' : ''}`}
          onClick={() => setActiveTab('offers')}
        >
          Ride Offers ({filteredOffers.length})
        </button>
        <button 
          className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Ride Requests ({filteredRequests.length})
        </button>
      </div>

      <RideFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        showVehicleFilter={activeTab === 'offers'}
      />

      <div className="ride-board-content">
        {activeTab === 'offers' && (
          <div className="ride-offers">
            {filteredOffers.length === 0 ? (
              <div className="no-rides">
                <p>No ride offers match your filters.</p>
                {!user && (
                  <p>
                    <Button onClick={() => navigate("/")}>Login</Button> to see all rides
                  </p>
                )}
              </div>
            ) : (
              filteredOffers.map(offer => (
                <RideItem
                  key={offer.id}
                  type="offer"
                  ride={offer}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="ride-requests">
            {filteredRequests.length === 0 ? (
              <div className="no-rides">
                <p>No ride requests match your filters.</p>
                {!user && (
                  <p>
                    <Button onClick={() => navigate("/")}>Login</Button> to see all rides
                  </p>
                )}
              </div>
            ) : (
              filteredRequests.map(request => (
                <RideItem
                  key={request.id}
                  type="request"
                  ride={request}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};