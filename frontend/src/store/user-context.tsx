import { createContext, useContext, useState, useEffect, type FC } from "react";
import { login } from "../api/auth/authApi";

export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  rating: number;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  signOut: () => void;
  register: (data: { name: string; email: string; password: string }) => Promise<User>;
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
  const register = async (data: { name: string; email: string; password: string }) => {
    // In real app, send to backend. Here we just fabricate a user.
    const newUser: User = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email.toLowerCase(),
      isVerified: false,
      rating: 5,
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
    };

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