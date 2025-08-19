import type { FC } from "react";
import { useUser } from "../store/user-context";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/UI/Button";
import { VoucherDisplay } from "../components/Voucher/VoucherDisplay";
import { VoucherCalculator } from "../components/Voucher/VoucherCalculator";

export const VoucherSummary: FC = () => {
  const { isLoggedIn, canOfferRides } = useUser();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <div className="voucher-summary-page">
        <h1>Login Required</h1>
        <p>You must be logged in to view your voucher summary.</p>
        <Button onClick={() => navigate("/")}>
          Go Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="voucher-summary-page">
      <h1>☕ Voucher Summary</h1>
      
      <div className="voucher-content">
        <VoucherDisplay showTransactions={true} />
        
        <VoucherCalculator />
        
        <div className="voucher-info-section">
          <h2>How Vouchers Work</h2>
          <div className="voucher-info-grid">
            <div className="voucher-info-item">
              <h4>Earn Vouchers</h4>
              <p>Get vouchers when other users join your ride offers</p>
            </div>
            <div className="voucher-info-item">
              <h4>Spend Vouchers</h4>
              <p>Use vouchers to pay for rides you join</p>
            </div>
            <div className="voucher-info-item">
              <h4>Size Matters</h4>
              <p>Voucher size depends on distance and vehicle type</p>
            </div>
          </div>
        </div>

        <div className="voucher-actions">
          <Button onClick={() => navigate("/rideboard")}>
            Browse Rides
          </Button>
          {canOfferRides && (
            <Button onClick={() => navigate("/offer-ride")} variant="secondary">
              Offer a Ride
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};