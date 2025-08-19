import type { FC } from "react";
import { useUser } from "../store/user-context";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/UI/Button";
import { UserProfile as UserProfileComponent } from "../components/User/UserProfile";
// import { UserVerification } from "../components/User/UserVerification";
// import { VehicleList } from "../components/Vehicle/VehicleList";
// import { VehicleForm } from "../components/Vehicle/VehicleForm";
// import { VoucherDisplay } from "../components/Voucher/VoucherDisplay";

export const UserProfile: FC = () => {
  const { user, isLoggedIn, canOfferRides } = useUser();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <div className="user-profile-page">
        <h1>Login Required</h1>
        <p>You must be logged in to view your profile.</p>
        <Button onClick={() => navigate("/")}>
          Go Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <h1>👤 User Profile</h1>
      
      <div className="profile-sections">
        <div className="profile-grid">
          <UserProfileComponent />
          
          {/* <UserVerification 
            isVerified={user?.isVerified || false}
            onRequestVerification={() => alert("Verification request coming soon!")}
          /> */}
        </div>

        {/* <VoucherDisplay compact={true} /> */}
        
        {/* <VehicleList />
        
        <VehicleForm onSubmit={() => console.log("Vehicle added successfully!")} /> */}

        <div className="quick-actions-section">
          <h2>⚡ Quick Actions</h2>
          <div className="action-buttons">
            <Button onClick={() => navigate("/vouchers")}>
              View Voucher Balance
            </Button>
            <Button onClick={() => navigate("/rideboard")} variant="secondary">
              Browse Rides
            </Button>
            {canOfferRides && (
              <Button onClick={() => navigate("/offer-ride")} variant="secondary">
                Offer a Ride
              </Button>
            )}
            {canOfferRides && (
              <div className="profile-tip">
                <p>💡 Complete your driver's license and vehicle info to offer rides!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};