import { type FC } from "react";
import { Card } from "../UI/Card";
import { Button } from "../UI/Button";

interface UserVerificationProps {
  isVerified: boolean;
  onRequestVerification?: () => void;
}

export const UserVerification: FC<UserVerificationProps> = ({ 
  isVerified, 
  onRequestVerification 
}) => {
  return (
    <Card className="user-verification">
      <h3>🔒 Account Verification</h3>
      
      <div className="verification-status">
        {isVerified ? (
          <div className="verified-status">
            <span className="status-icon">✅</span>
            <div className="status-text">
              <h4>Verified Account</h4>
              <p>Your account has been verified. You can offer and request rides.</p>
            </div>
          </div>
        ) : (
          <div className="unverified-status">
            <span className="status-icon">⏳</span>
            <div className="status-text">
              <h4>Pending Verification</h4>
              <p>Your account is pending verification. Some features may be limited.</p>
            </div>
          </div>
        )}
      </div>

      {!isVerified && (
        <div className="verification-actions">
          <p>To verify your account, please ensure you have:</p>
          <ul>
            <li>Valid driver's license information</li>
            <li>Vehicle registration details</li>
            <li>Confirmed email address</li>
          </ul>
          
          <Button onClick={onRequestVerification} disabled>
            Request Verification
          </Button>
        </div>
      )}

      <div className="verification-benefits">
        <h4>Verification Benefits</h4>
        <ul>
          <li>Offer rides to other users</li>
          <li>Higher trust rating</li>
          <li>Access to premium features</li>
          <li>Priority in ride matching</li>
        </ul>
      </div>
    </Card>
  );
};