import { createContext, useContext, useState, useEffect, type FC } from "react";
import { login, registerApi } from "../api/auth/authApi";
import { updateUser, type UpdateUserPayload } from "../api/user/userApi";

export interface User {
  id: string;
  name: string;
  email: string;
  homeAddress: string;
  mobilePhoneNumber: string;
  isVerified: boolean;
  rating: number;
  vehicleType?: string;
  vehiclePlate?: string;
  driversLicenseNumber?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
  homeAddress: string;
  mobilePhoneNumber: string;
  vehicleType?: string;
  vehiclePlate?: string;
  driversLicenseNumber?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  signOut: () => void;
  register: (data: RegisterInput) => Promise<User>;
  signIn: (data: { email: string; password: string }) => Promise<User>;
  updateProfile: (data: UpdateUserPayload) => Promise<User>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const isLoggedIn = user !== null;

  // Load persisted user
  useEffect(() => {
    try {
      const raw = localStorage.getItem("joeRideUser");
      if (raw) {
        setUser(JSON.parse(raw));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Persist user
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("joeRideUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("joeRideUser");
      }
    } catch (e) {
      // ignore persistence errors
    }
  }, [user]);

  // const signOut = () => setUser(null);
  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Mock register & sign in (no backend yet)
  const register = async (data: RegisterInput) => {
    const res = await registerApi({
      fullName: data.name,
      email: data.email,
      password: data.password,
      dateOfBirth: data.dateOfBirth,
      homeAddress: data.homeAddress,
      mobilePhoneNumber: data.mobilePhoneNumber,
      vehicleType: data.vehicleType,
      vehiclePlate: data.vehiclePlate,
      driversLicenseNumber: data.driversLicenseNumber,
    });

    // Map backend response -> User type
    const newUser: User = {
      id: res.id,
      name: res.fullName ?? res.name,
      email: res.email,
      homeAddress: res.homeAddress ?? "",
      mobilePhoneNumber: res.mobilePhoneNumber ?? "",
      vehiclePlate: res.vehiclePlate ?? "",
      driversLicenseNumber: res.driversLicenseNumber ?? "",
      vehicleType: res.vehicleType ?? "", // Default to "Car" if not provided
      isVerified: res.isVerified ?? false,
      rating: res.rating ?? 5,
    };

    setUser(newUser);
    return newUser;
  };

  const signIn = async (data: { email: string; password: string }) => {
    const res = await login(data);

    // Example backend login response:
    // { message: "Login successful", user: { id, email, fullName, isVerified, rating } }
    const loggedUser: User = {
      id: res.user.id,
      name: res.user.fullName ?? res.user.name,
      email: res.user.email,
      homeAddress: res.user.homeAddress ?? "",
      mobilePhoneNumber: res.user.mobilePhoneNumber ?? "",
      vehiclePlate: res.user.vehiclePlate ?? "",
      driversLicenseNumber: res.user.driversLicenseNumber ?? "",
      vehicleType: res.user.vehicleType,
      isVerified: res.user.isVerified ?? false,
      rating: res.user.rating ?? 5,
    };

    localStorage.setItem("userId", res.user.id);

    setUser(loggedUser);
    console.log("User signed in:", loggedUser);
    return loggedUser;

  };

  const updateProfile = async (data: UpdateUserPayload): Promise<User> => {
    if (!user) {
      throw new Error("No user logged in");
    }

    try {
      // Prepare update data, excluding empty password
      const updateData: UpdateUserPayload = {
        fullName: data.fullName,
        email: data.email,
        homeAddress: data.homeAddress,
        mobilePhoneNumber: data.mobilePhoneNumber,
        vehicleType: data.vehicleType,
        vehiclePlate: data.vehiclePlate,
        driversLicenseNumber: data.driversLicenseNumber,
      };
      
      // Only include password if it's provided and not empty
      if (data.password && data.password.trim() !== '') {
        updateData.password = data.password;
      }

      const updatedUserData = await updateUser(user.id, updateData);

      // Map the backend response to our User type
      const updatedUser: User = {
        ...user,
        name: updatedUserData.fullName || updatedUserData.name || user.name,
        email: updatedUserData.email || user.email,
        homeAddress: updatedUserData.homeAddress || user.homeAddress,
        mobilePhoneNumber: updatedUserData.mobilePhoneNumber || user.mobilePhoneNumber,
        vehicleType: updatedUserData.vehicleType || user.vehicleType,
        vehiclePlate: updatedUserData.vehiclePlate || user.vehiclePlate,
        driversLicenseNumber: updatedUserData.driversLicenseNumber || user.driversLicenseNumber,
      };

      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn, signOut, register, signIn, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};