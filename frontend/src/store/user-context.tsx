import { createContext, useContext, useState, useEffect, type FC } from "react";
import { login, registerApi } from "../api/auth/authApi";

export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  rating: number;
  driversLicenseNumber?: string;
  hasValidLicense?: boolean;
  vehicleType?: string;
  vehiclePlate?: string;
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
  canOfferRides: boolean;
  signOut: () => void;
  register: (data: RegisterInput) => Promise<User>;
  signIn: (data: { email: string; password: string }) => Promise<User>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const isLoggedIn = user !== null;

  // Check if user can offer rides (has valid license and vehicle info)
  const canOfferRides = isLoggedIn && 
    user?.hasValidLicense === true && 
    !!user?.vehicleType && 
    !!user?.vehiclePlate;

  // Load persisted user
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem("joeRideUser");
      if (rawUser) {
        setUser(JSON.parse(rawUser));
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
      isVerified: res.isVerified ?? false,
      rating: res.rating ?? 5,
      driversLicenseNumber: data.driversLicenseNumber,
      hasValidLicense: !!data.driversLicenseNumber,
      vehicleType: data.vehicleType,
      vehiclePlate: data.vehiclePlate,
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
      isVerified: res.user.isVerified ?? false,
      rating: res.user.rating ?? 5,
      driversLicenseNumber: res.user.driversLicenseNumber,
      hasValidLicense: !!res.user.driversLicenseNumber,
      vehicleType: res.user.vehicleType,
      vehiclePlate: res.user.vehiclePlate,
    };

    localStorage.setItem("userId", res.user.id);

    setUser(loggedUser);
    console.log("User signed in:", loggedUser);
    return loggedUser;

  };

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn, canOfferRides, signOut, register, signIn }}>
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