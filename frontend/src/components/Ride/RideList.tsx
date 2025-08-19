import { type FC } from "react";
import { RideItem } from "./RideItem";
import { type RideOffer, type RideRequest } from "../../store/rides-context";

interface RideListProps {
  type: 'offers' | 'requests';
  rides: RideOffer[] | RideRequest[];
  emptyMessage?: string;
}

export const RideList: FC<RideListProps> = ({ 
  type, 
  rides, 
  emptyMessage = "No rides available" 
}) => {
  if (rides.length === 0) {
    return (
      <div className="no-rides">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="ride-list">
      {rides.map(ride => (
        <RideItem
          key={ride.id}
          type={type === 'offers' ? 'offer' : 'request'}
          ride={ride}
        />
      ))}
    </div>
  );
};