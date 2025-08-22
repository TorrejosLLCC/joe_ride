import type { FC } from "react";
import { ProfilePage } from "../components/User/UserProfile";

export const UserProfile: FC = () => {
  return (
    <div className="user-profile-page">
      <ProfilePage />
    </div>
  );
};