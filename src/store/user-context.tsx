import { createContext, useContext, useState, useEffect, type FC } from "react";

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

  const signOut = () => setUser(null);

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
    // For mock, if existing persisted user matches email, reuse; otherwise create placeholder user
    const currentRaw = localStorage.getItem("joeRideUser");
    if (currentRaw) {
      const existing: User = JSON.parse(currentRaw);
      if (existing.email.toLowerCase() === data.email.toLowerCase()) {
        setUser(existing);
        return existing;
      }
    }
    const placeholder: User = {
      id: crypto.randomUUID(),
      name: data.email.split("@")[0] || "Rider",
      email: data.email.toLowerCase(),
      isVerified: false,
      rating: 5,
    };
    setUser(placeholder);
    return placeholder;
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