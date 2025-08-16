import type { FC } from "react";
import { Button } from "../components/UI/Button";

export const Home: FC = () => {
  return (
    <div className="home-page">
        <h1>Joe Ride</h1>
        <p>Your coffee-powered ride sharing platform</p>
        <div className="actions">
            <Button onClick={() => console.log("Offer ride")}>Offer a Ride</Button>
            <Button onClick={() => console.log("Request ride")} variant="secondary">Request a Ride</Button>
        </div>
    </div>
  )
};
