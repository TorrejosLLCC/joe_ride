import { createContext, useContext, useState, type FC } from "react";

interface RideOffer {
  id: string;
  driverId: string;
  from: string;
  to: string;
  departureTime: Date;
  availableSeats: number;
  pricePerSeat: number;
  voucherRequired: number;
  vehicleId: string;
}

interface RideRequest {
  id: string;
  passengerId: string;
  from: string;
  to: string;
  preferredTime: Date;
  maxPrice: number;
  voucherOffered: number;
}

interface RidesContextType {
  offers: RideOffer[];
  requests: RideRequest[];
  addOffer: (offer: Omit<RideOffer, 'id'>) => void;
  addRequest: (request: Omit<RideRequest, 'id'>) => void;
  removeOffer: (id: string) => void;
  removeRequest: (id: string) => void;
}

const RidesContext = createContext<RidesContextType | undefined>(undefined);

export const RidesProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [offers, setOffers] = useState<RideOffer[]>([]);
  const [requests, setRequests] = useState<RideRequest[]>([]);

  const addOffer = (offerData: Omit<RideOffer, 'id'>) => {
    const newOffer = {
      ...offerData,
      id: crypto.randomUUID(),
    };
    setOffers(prev => [...prev, newOffer]);
  };

  const addRequest = (requestData: Omit<RideRequest, 'id'>) => {
    const newRequest = {
      ...requestData,
      id: crypto.randomUUID(),
    };
    setRequests(prev => [...prev, newRequest]);
  };

  const removeOffer = (id: string) => {
    setOffers(prev => prev.filter(offer => offer.id !== id));
  };

  const removeRequest = (id: string) => {
    setRequests(prev => prev.filter(request => request.id !== id));
  };

  return (
    <RidesContext.Provider value={{ 
      offers, 
      requests, 
      addOffer, 
      addRequest, 
      removeOffer, 
      removeRequest 
    }}>
      {children}
    </RidesContext.Provider>
  );
};

export const useRides = () => {
  const context = useContext(RidesContext);
  if (!context) {
    throw new Error("useRides must be used within a RidesProvider");
  }
  return context;
};