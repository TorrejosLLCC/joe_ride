import type { FC } from "react";
import RideList from "../components/Ride/RideList";

export const RideBoard: FC = () => {
  return (
    <div className="ride-board-page">
      <h1>Ride Board</h1>
      <p>Browse available rides and requests</p>
      {/* RideBoard component will be implemented later */}
      <RideList />
    </div>
  );
};