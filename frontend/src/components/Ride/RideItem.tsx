import React from "react";
import { Button } from "../UI/Button";
import { Card } from "../UI/Card";
import type { RideOffer, RideRequest } from "../../types";
import { formatVoucherSize } from "../../utils/voucherCalculator";

interface RideItemProps {
  ride: RideOffer | RideRequest;
  type: 'offer' | 'request';
  onJoin?: (rideId: string) => void;
  onContact?: (rideId: string) => void;
  showActions?: boolean;
}

export const RideItem: React.FC<RideItemProps> = ({
  ride,
  type,
  onJoin,
  onContact,
  showActions = true
}) => {
  const isOffer = type === 'offer';
  const rideOffer = isOffer ? ride as RideOffer : null;
  const rideRequest = !isOffer ? ride as RideRequest : null;

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatTimeRange = (startTime: string, endTime: string, date?: string) => {
    const dateStr = date ? new Date(date).toLocaleDateString() : '';
    return `${dateStr} ${startTime} - ${endTime}`;
  };

  return (
    <Card>
      <div className="ride-item">
        <div className="ride-header">
          <h3 className="ride-title">
            {ride.origin} → {ride.destination}
          </h3>
          <span className={`ride-type-badge ${type}`}>
            {type === 'offer' ? '🚗 Offer' : '🙋 Request'}
          </span>
        </div>

        <div className="ride-details">
          {isOffer && rideOffer && (
            <>
              <div className="detail-row">
                <span className="label">Driver:</span>
                <span className="value">{rideOffer.driver.name}</span>
              </div>
              <div className="detail-row">
                <span className="label">Departure:</span>
                <span className="value">{formatDateTime(rideOffer.departureDateTime)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Vehicle:</span>
                <span className="value">{rideOffer.vehicleType}</span>
              </div>
              <div className="detail-row">
                <span className="label">Available Seats:</span>
                <span className="value">{rideOffer.availableSeats} / {rideOffer.seatCapacity}</span>
              </div>
            </>
          )}

          {!isOffer && rideRequest && (
            <>
              <div className="detail-row">
                <span className="label">Passenger:</span>
                <span className="value">{rideRequest.passenger.name}</span>
              </div>
              <div className="detail-row">
                <span className="label">Preferred Time:</span>
                <span className="value">
                  {formatTimeRange(
                    rideRequest.preferredDate,
                    rideRequest.preferredTimeFrom,
                    rideRequest.preferredTimeTo,
                  )}
                </span>
              </div>
            </>
          )}

          <div className="detail-row">
            <span className="label">Distance:</span>
            <span className="value">{ride.distanceKm} km</span>
          </div>

          <div className="detail-row">
            <span className="label">Voucher Required:</span>
            <span className="value voucher-requirement">
              ☕ {formatVoucherSize(ride.voucherRequirement)}
            </span>
          </div>
        </div>

        {showActions && (
          <div className="ride-actions">
            {isOffer && rideOffer && rideOffer.availableSeats > 0 && onJoin && (
              <Button onClick={() => onJoin(ride.id)}>
                Join Ride
              </Button>
            )}
            
            {!isOffer && onContact && (
              <Button onClick={() => onContact(ride.id)}>
                Offer Ride
              </Button>
            )}

            {isOffer && rideOffer && rideOffer.availableSeats === 0 && (
              <Button disabled variant="secondary">
                Full
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};