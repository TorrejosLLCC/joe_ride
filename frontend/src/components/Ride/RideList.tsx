import React from "react";
import { RideItem } from "./RideItem";
import type { RideOffer, RideRequest } from "../../types";

interface RideListProps {
  offers: RideOffer[];
  requests: RideRequest[];
  onJoinRide?: (rideId: string) => void;
  onContactForRequest?: (requestId: string) => void;
  showOffers?: boolean;
  showRequests?: boolean;
}

export const RideList: React.FC<RideListProps> = ({
  offers,
  requests,
  onJoinRide,
  onContactForRequest,
  showOffers = true,
  showRequests = true
}) => {
  const hasOffers = showOffers && offers.length > 0;
  const hasRequests = showRequests && requests.length > 0;
  const hasAnyRides = hasOffers || hasRequests;

  if (!hasAnyRides) {
    return (
      <div className="ride-list-empty">
        <p>No rides available at the moment.</p>
        <p>Be the first to offer or request a ride!</p>
      </div>
    );
  }

  return (
    <div className="ride-list">
      {showOffers && offers.length > 0 && (
        <div className="ride-section">
          <h3 className="section-title">Available Rides</h3>
          <div className="rides-grid">
            {offers.map(offer => (
              <RideItem
                key={offer.id}
                ride={offer}
                type="offer"
                onJoin={onJoinRide}
              />
            ))}
          </div>
        </div>
      )}

      {showRequests && requests.length > 0 && (
        <div className="ride-section">
          <h3 className="section-title">Ride Requests</h3>
          <div className="rides-grid">
            {requests.map(request => (
              <RideItem
                key={request.id}
                ride={request}
                type="request"
                onContact={onContactForRequest}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};