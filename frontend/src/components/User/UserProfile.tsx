import { type FC } from "react";
import { useUser } from "../../store/user-context";
import { Card } from "../UI/Card";
import { Button } from "../UI/Button";

export const UserProfile: FC = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <Card>
        <p>Please log in to view your profile.</p>
      </Card>
    );
  }

  return (
    <Card className="user-profile-component">
      <h3>👤 Profile Information</h3>
      
      <div className="profile-avatar">
        <div className="avatar-placeholder">
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="profile-details">
        <div className="detail-item">
          <label>Name:</label>
          <span>{user.name}</span>
        </div>
        
        <div className="detail-item">
          <label>Email:</label>
          <span>{user.email}</span>
        </div>
        
        {/* <div className="detail-item">
          <label>Verification Status:</label>
          <span className={user.isVerified ? 'verified' : 'unverified'}>
            {user.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
          </span>
        </div>
        
        <div className="detail-item">
          <label>Rating:</label>
          <span className="rating">
            {user.rating ? `⭐ ${user.rating}/5` : 'No ratings yet'}
          </span>
        </div> */}
      </div>

      <div className="profile-actions">
        <Button onClick={() => alert("Edit profile functionality coming soon!")}>
          Edit Profile
        </Button>
      </div>
    </Card>
  );
};