import { createContext, useContext, useState, type FC } from "react";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  seats: number;
}

interface VehicleContextType {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  removeVehicle: (id: string) => void;
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const addVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVehicle = {
      ...vehicleData,
      id: crypto.randomUUID(),
    };
    setVehicles(prev => [...prev, newVehicle]);
  };

  const removeVehicle = (id: string) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
    if (selectedVehicle?.id === id) {
      setSelectedVehicle(null);
    }
  };

  return (
    <VehicleContext.Provider value={{ 
      vehicles, 
      addVehicle, 
      removeVehicle, 
      selectedVehicle, 
      setSelectedVehicle 
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