import type { FC } from "react";
import { UserProfile as UserProfileComponent } from "../components/User/UserProfile";

export const UserProfile: FC = () => {
  return (
    <div className="user-profile-page">
      <UserProfileComponent />
    </div>
  );
};