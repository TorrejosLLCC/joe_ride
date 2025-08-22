import { createContext, useContext, useState, useEffect, type FC } from "react";
import { login, registerApi } from "../api/auth/authApi";

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

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn, signOut, register, signIn }}>
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