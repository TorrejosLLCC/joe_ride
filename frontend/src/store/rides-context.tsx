import { createContext, useContext, useState, useEffect, type FC } from "react";
import { type VehicleType, type VoucherSize } from "../utils/voucherCalculator";
import { getAllRideOffers, createOfferRide } from "../api/rides/offerRideApi";
import { getAllRideRequests, createRideRequest } from "../api/rides/requestRideApi";

export interface RideOffer {
  id: string;
  userId: string;
  origin: string;
  destination: string;
  departureDateTime: string;
  vehicleType: VehicleType;
  seatCapacity: number;
  distanceKm: number;
  voucherRequired: VoucherSize;
  status: 'active' | 'completed' | 'cancelled';
  passengers?: string[]; // user IDs who joined
}

export interface RideRequest {
  id: string;
  userId: string;
  origin: string;
  destination: string;
  preferredDepartureTime: string;
  distanceKm: number;
  voucherOffered: VoucherSize;
  status: 'active' | 'matched' | 'completed' | 'cancelled';
}

interface RidesContextType {
  offers: RideOffer[];
  requests: RideRequest[];
  loadRides: () => Promise<void>;
  createOffer: (offer: Omit<RideOffer, 'id' | 'passengers' | 'status'>) => Promise<void>;
  createRequest: (request: Omit<RideRequest, 'id' | 'status'>) => Promise<void>;
  joinRide: (offerId: string) => Promise<void>;
  cancelOffer: (id: string) => Promise<void>;
  cancelRequest: (id: string) => Promise<void>;
}

const RidesContext = createContext<RidesContextType | undefined>(undefined);

export const RidesProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [offers, setOffers] = useState<RideOffer[]>([]);
  const [requests, setRequests] = useState<RideRequest[]>([]);

  const loadRides = async () => {
    try {
      console.log("Loading rides from API...");
      
      // Fetch both offers and requests from backend
      const [offersData, requestsData] = await Promise.all([
        getAllRideOffers(),
        getAllRideRequests()
      ]);
      
      // Map backend data to frontend format
      const mappedOffers: RideOffer[] = offersData.map((offer: any) => ({
        id: offer.id,
        userId: offer.driverId,
        origin: offer.fromLocation,
        destination: offer.toLocation,
        departureDateTime: offer.departureTime,
        vehicleType: offer.vehicleType as VehicleType,
        seatCapacity: offer.capacity,
        distanceKm: offer.distanceKm,
        voucherRequired: offer.voucherRequired === 1 ? 'Short' : 
                        offer.voucherRequired === 2 ? 'Tall' : 
                        offer.voucherRequired === 3 ? 'Grande' :
                        offer.voucherRequired === 4 ? 'Venti' : 'Trenta',
        status: offer.status === 'OPEN' ? 'active' : 'completed',
        passengers: [], // TODO: Add passengers if available in backend
      }));
      
      const mappedRequests: RideRequest[] = requestsData.map((request: any) => ({
        id: request.id,
        userId: request.passengerId,
        origin: request.origin,
        destination: request.destination,
        preferredDepartureTime: `${request.departureDate}T${request.departureWindowStart}`,
        distanceKm: request.kilometerCount,
        voucherOffered: 'Short' as VoucherSize, // TODO: Calculate based on distance
        status: request.status === 'OPEN' ? 'active' : 'completed',
      }));
      
      setOffers(mappedOffers);
      setRequests(mappedRequests);
      
      console.log("Loaded offers:", mappedOffers);
      console.log("Loaded requests:", mappedRequests);
    } catch (error) {
      console.error("Failed to load rides:", error);
      // Don't throw error, just log it so the UI doesn't break
    }
  };

  const createOffer = async (offerData: Omit<RideOffer, 'id' | 'passengers' | 'status'>) => {
    try {
      // Create offer via backend API
      const backendPayload = {
        fromLocation: offerData.origin,
        toLocation: offerData.destination,
        departureTime: offerData.departureDateTime, // Send as ISO string
        capacity: offerData.seatCapacity,
        vehicleType: offerData.vehicleType,
        distanceKm: offerData.distanceKm,
        voucherRequired: offerData.voucherRequired === 'Short' ? 1 : 
                        offerData.voucherRequired === 'Tall' ? 2 : 
                        offerData.voucherRequired === 'Grande' ? 3 :
                        offerData.voucherRequired === 'Venti' ? 4 : 5,
      };
      
      const response = await createOfferRide(backendPayload);
      console.log("Created ride offer via API:", response);
      
      // Reload rides to get updated data
      await loadRides();
    } catch (error) {
      console.error("Failed to create ride offer:", error);
      throw error;
    }
  };

  const createRequest = async (requestData: Omit<RideRequest, 'id' | 'status'>) => {
    try {
      // Create request via backend API
      const [, time] = requestData.preferredDepartureTime.split('T');
      const backendPayload = {
        origin: requestData.origin,
        destination: requestData.destination,
        departureWindowStart: time || '00:00',
        departureWindowEnd: time || '23:59', // Use same time for both start and end for now
        kilometerCount: requestData.distanceKm,
      };
      
      const response = await createRideRequest(backendPayload);
      console.log("Created ride request via API:", response);
      
      // Reload rides to get updated data
      await loadRides();
    } catch (error) {
      console.error("Failed to create ride request:", error);
      throw error;
    }
  };

  const joinRide = async (offerId: string) => {
    try {
      // TODO: Replace with actual API call
      // await api.post(`/ride-offers/${offerId}/join`);
      
      // For now, update locally
      setOffers(prev => prev.map(offer => 
        offer.id === offerId 
          ? { ...offer, passengers: [...(offer.passengers || []), 'current-user-id'] }
          : offer
      ));
      console.log("Joined ride:", offerId);
    } catch (error) {
      console.error("Failed to join ride:", error);
      throw error;
    }
  };

  const cancelOffer = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      // await api.delete(`/ride-offers/${id}`);
      
      setOffers(prev => prev.filter(offer => offer.id !== id));
      console.log("Cancelled ride offer:", id);
    } catch (error) {
      console.error("Failed to cancel ride offer:", error);
      throw error;
    }
  };

  const cancelRequest = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      // await api.delete(`/ride-requests/${id}`);
      
      setRequests(prev => prev.filter(request => request.id !== id));
      console.log("Cancelled ride request:", id);
    } catch (error) {
      console.error("Failed to cancel ride request:", error);
      throw error;
    }
  };

  // Load rides on mount
  useEffect(() => {
    loadRides();
  }, []);

  return (
    <RidesContext.Provider value={{ 
      offers, 
      requests, 
      loadRides,
      createOffer, 
      createRequest, 
      joinRide,
      cancelOffer, 
      cancelRequest 
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