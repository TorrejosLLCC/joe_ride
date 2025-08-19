import { createContext, useContext, useEffect, useState, type FC } from "react";
import { createOfferRide, getAllRideOffers } from "../api/rides/offerRideApi";
import type { OfferRidePayload } from "../api/rides/offerRideApi";

interface RideOffer {
  id: string;
  driverId: string;
  from: string;
  to: string;
  departureTime: Date;
  availableSeats: number;
  pricePerSeat: number | null;
  voucherRequired: boolean;
  vehicleType: string;
  distanceKm: number;
  status: string;
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


  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const offers = await getAllRideOffers();
        setOffers(offers);
      } catch (error) {
        console.error("Failed to fetch offers", error);
      }
    };
    fetchOffers();
  }, []);
  console.log(offers);


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
        distanceKm: res.distanceKm ?? 0, // fallback to 0 if undefined
        status: res.status ?? "pending", // fallback to "pending" if undefined
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