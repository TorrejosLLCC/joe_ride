import { type FC } from "react";
import { type RideOffer, type RideRequest } from "../../store/rides-context";
import { useUser } from "../../store/user-context";
import { useRides } from "../../store/rides-context";
import { Button } from "../UI/Button";
import { Card } from "../UI/Card";

interface RideItemProps {
  type: 'offer' | 'request';
  ride: RideOffer | RideRequest;
}

export const RideItem: FC<RideItemProps> = ({ type, ride }) => {
  const { user } = useUser();
  const { joinRide, cancelOffer, cancelRequest } = useRides();

  const isMyRide = ride.userId === user?.id;
  const isOffer = type === 'offer';
  const offerRide = isOffer ? ride as RideOffer : null;
  const requestRide = !isOffer ? ride as RideRequest : null;

  const handleJoinRide = async () => {
    if (!user) {
      alert("Please login to join a ride");
      return;
    }
    
    if (offerRide) {
      try {
        await joinRide(offerRide.id);
        alert("Successfully joined the ride!");
      } catch (error) {
        alert("Failed to join ride. Please try again.");
      }
    }
  };

  const handleCancelRide = async () => {
    if (!confirm("Are you sure you want to cancel this ride?")) {
      return;
    }

    try {
      if (isOffer) {
        await cancelOffer(ride.id);
      } else {
        await cancelRequest(ride.id);
      }
      alert("Ride cancelled successfully");
    } catch (error) {
      alert("Failed to cancel ride. Please try again.");
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <Card className="ride-item">
      <div className="ride-item-header">
        <h3 className="ride-type">{isOffer ? "Ride Offer" : "Ride Request"}</h3>
        <span className="ride-status">{ride.status}</span>
      </div>

      <div className="ride-item-content">
        <div className="ride-route">
          <div className="route-point">
            <strong>From:</strong> {ride.origin}
          </div>
          <div className="route-point">
            <strong>To:</strong> {ride.destination}
          </div>
        </div>

        <div className="ride-details">
          <div className="detail-item">
            <strong>Departure:</strong> {formatDateTime(
              isOffer ? offerRide!.departureDateTime : requestRide!.preferredDepartureTime
            )}
          </div>
          
          <div className="detail-item">
            <strong>Distance:</strong> {ride.distanceKm} km
          </div>

          {isOffer && offerRide && (
            <>
              <div className="detail-item">
                <strong>Vehicle:</strong> {offerRide.vehicleType}
              </div>
              <div className="detail-item">
                <strong>Available Seats:</strong> {offerRide.seatCapacity - (offerRide.passengers?.length || 0)} / {offerRide.seatCapacity}
              </div>
              <div className="detail-item">
                <strong>Voucher Required:</strong> {offerRide.voucherRequired}
              </div>
            </>
          )}

          {!isOffer && requestRide && (
            <div className="detail-item">
              <strong>Voucher Offered:</strong> {requestRide.voucherOffered}
            </div>
          )}
        </div>
      </div>

      <div className="ride-item-actions">
        {isMyRide ? (
          <Button variant="danger" onClick={handleCancelRide}>
            Cancel {isOffer ? "Offer" : "Request"}
          </Button>
        ) : (
          <>
            {isOffer && offerRide && (
              <Button 
                onClick={handleJoinRide}
                disabled={!user || (offerRide.passengers?.length || 0) >= offerRide.seatCapacity}
              >
                {(offerRide.passengers?.length || 0) >= offerRide.seatCapacity ? "Full" : "Join Ride"}
              </Button>
            )}
            {!isOffer && (
              <Button disabled>
                Contact Requester
              </Button>
            )}
          </>
        )}
      </div>
    </Card>
  );
};