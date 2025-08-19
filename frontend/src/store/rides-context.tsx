import { createContext, useContext, useState, type FC } from "react";
import { createOfferRide } from "../api/rides/offerRideApi";
import type { OfferRidePayload } from "../api/rides/offerRideApi";

interface RideOffer {
  id: string;
  driverId: string;
  from: string;
  to: string;
  departureTime: Date;
  availableSeats: number;
  pricePerSeat: number;
  voucherRequired: boolean;
  vehicleType: string;
}

// "fromLocation": "cebu",
// "toLocation": "lapulapu",
// "departureTime": "2025-08-20T08:30:00.000Z",
// "capacity": 5,
// "pricePerSeat": 500,
// "voucherRequired": false,
// "vehicleType": "van",
// "distanceKm": 20.1


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
  addOffer: (offer: OfferRidePayload) => void;
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

  const addOffer = async (offerData: OfferRidePayload) => {
    try {
      const res = await createOfferRide(offerData);

      const newOffer: RideOffer = {
        id: res.id,
        driverId: res.driverId,
        from: res.fromLocation, // BE field
        to: res.toLocation, // BE field
        departureTime: res.departureTime,
        availableSeats: res.availableSeats,
        pricePerSeat: res.pricePerSeat,
        voucherRequired: res.voucherRequired,
        vehicleType: res.vehicleType, // adjust
      };

      setOffers(prev => [...prev, newOffer]);
    } catch (error) {
      console.error("Failed to create ride offer", error);
    }
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