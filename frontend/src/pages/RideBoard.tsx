import type { FC } from "react";
import { RideBoard as RideBoardComponent } from "../components/RideBoard/RideBoard";

export const RideBoard: FC = () => {
  return (
    <div className="ride-board-page">
      <RideBoardComponent />
    </div>
  );
};