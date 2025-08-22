import { useUser } from "../../store/user-context";

export const Profile = () => {
  const { user } = useUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <div className="profile-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Vehicle Type:</strong> {user.vehicleType}</p>
        <p><strong>Home Address:</strong> {user.homeAddress}</p>
        <p><strong>Phone:</strong> {user.mobilePhoneNumber}</p>
        {user.vehiclePlate && <p><strong>Vehicle Plate:</strong> {user.vehiclePlate}</p>}
        {user.driversLicenseNumber && <p><strong>License:</strong> {user.driversLicenseNumber}</p>}
      </div>
    </div>
  );
};