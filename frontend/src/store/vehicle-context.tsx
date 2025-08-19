import { createContext, useContext, useState, useEffect, type FC } from "react";
import { type VehicleType } from "../utils/voucherCalculator";

export interface Vehicle {
  id: string;
  userId: string;
  type: VehicleType;
  licensePlate: string;
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  seatCapacity: number;
  isActive: boolean;
}

interface VehicleContextType {
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  setActiveVehicle: (vehicle: Vehicle | null) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'userId'>) => Promise<void>;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  loadUserVehicles: () => Promise<void>;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null);

  const loadUserVehicles = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/vehicles');
      // setVehicles(response.data);
      
      // For now, use mock data from localStorage
      const savedVehicles = localStorage.getItem('joeRideVehicles');
      if (savedVehicles) {
        const parsedVehicles = JSON.parse(savedVehicles);
        setVehicles(parsedVehicles);
        
        // Set first active vehicle as default
        const activeVeh = parsedVehicles.find((v: Vehicle) => v.isActive);
        if (activeVeh) {
          setActiveVehicle(activeVeh);
        }
      }
    } catch (error) {
      console.error("Failed to load vehicles:", error);
    }
  };

  const addVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'userId'>) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/vehicles', vehicleData);
      // const newVehicle = response.data;
      
      // For now, create locally
      const newVehicle: Vehicle = {
        ...vehicleData,
        id: crypto.randomUUID(),
        userId: 'current-user-id', // TODO: Get from auth context
      };
      
      const updatedVehicles = [...vehicles, newVehicle];
      setVehicles(updatedVehicles);
      localStorage.setItem('joeRideVehicles', JSON.stringify(updatedVehicles));
      
      // Set as active if it's the first vehicle or if no active vehicle
      if (!activeVehicle || vehicles.length === 0) {
        setActiveVehicle(newVehicle);
      }
      
      console.log("Added vehicle:", newVehicle);
    } catch (error) {
      console.error("Failed to add vehicle:", error);
      throw error;
    }
  };

  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    try {
      // TODO: Replace with actual API call
      // await api.put(`/vehicles/${id}`, updates);
      
      const updatedVehicles = vehicles.map(vehicle =>
        vehicle.id === id ? { ...vehicle, ...updates } : vehicle
      );
      
      setVehicles(updatedVehicles);
      localStorage.setItem('joeRideVehicles', JSON.stringify(updatedVehicles));
      
      // Update active vehicle if it was the one being updated
      if (activeVehicle?.id === id) {
        setActiveVehicle({ ...activeVehicle, ...updates });
      }
      
      console.log("Updated vehicle:", id);
    } catch (error) {
      console.error("Failed to update vehicle:", error);
      throw error;
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      // await api.delete(`/vehicles/${id}`);
      
      const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== id);
      setVehicles(updatedVehicles);
      localStorage.setItem('joeRideVehicles', JSON.stringify(updatedVehicles));
      
      // Clear active vehicle if it was deleted
      if (activeVehicle?.id === id) {
        setActiveVehicle(updatedVehicles.length > 0 ? updatedVehicles[0] : null);
      }
      
      console.log("Deleted vehicle:", id);
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
      throw error;
    }
  };

  // Load vehicles on mount
  useEffect(() => {
    loadUserVehicles();
  }, []);

  return (
    <VehicleContext.Provider value={{ 
      vehicles, 
      activeVehicle,
      setActiveVehicle,
      addVehicle, 
      updateVehicle, 
      deleteVehicle,
      loadUserVehicles
    }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error("useVehicle must be used within a VehicleProvider");
  }
  return context;
};