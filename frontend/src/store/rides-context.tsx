import { createContext, useContext, useState, useEffect, type FC } from "react";
import { createOfferRide, getAllRideOffers, type OfferRidePayload } from "../api/rides/offerRideApi";
import { createRideRequest, type RequestRidePayload, getAllRideRequests } from "../api/rides/requestRideApi";
import type { RideOffer, RideRequest, RideOfferForm, RideRequestForm } from "../types";
import { calculateVoucherRequirement } from "../utils/voucherCalculator";

interface RidesContextType {
  offers: RideOffer[];
  requests: RideRequest[];
  loading: boolean;
  error: string | null;
  fetchAllRides: () => Promise<void>;
  addOffer: (offer: RideOfferForm) => Promise<void>;
  addRequest: (request: RideRequestForm) => Promise<void>;
  removeOffer: (id: string) => void;
  removeRequest: (id: string) => void;
  joinRide: (offerId: string) => Promise<void>;
}

const RidesContext = createContext<RidesContextType | undefined>(undefined);

export const RidesProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [offers, setOffers] = useState<RideOffer[]>([]);
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllRides = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, only fetch ride offers since ride requests endpoint doesn't exist yet
      const offersData = await getAllRideOffers();

      // Transform backend data to frontend format
      const transformedOffers: RideOffer[] = offersData.map((offer: any) => ({
        id: offer.id.toString(),
        driverId: offer.driverId.toString(),
        driver: offer.driver || { id: offer.driverId.toString(), name: 'Unknown Driver', email: '', isVerified: false, rating: 5 },
        origin: offer.fromLocation,
        destination: offer.toLocation,
        departureDateTime: offer.departureTime, // Backend sends full datetime
        vehicleType: offer.vehicleType,
        seatCapacity: offer.capacity,
        availableSeats: offer.seatsAvailable || offer.capacity,
        distanceKm: offer.distanceKm,
        voucherRequirement: calculateVoucherRequirement(offer.distanceKm, offer.vehicleType),
        status: offer.status === 'open' ? 'active' : 'completed',
        passengers: [],
        createdAt: offer.createdAt || new Date().toISOString()
      }));

      const requestsData = await getAllRideRequests();
      // Transform backend data to frontend format
      const transformedRequests: RideRequest[] = [] = requestsData.map((request: any) => ({
        id: request.id.toString(),
        passengerId: request.userId.toString(),
        passenger: request.user || { id: request.userId.toString(), name: 'Unknown Passenger', email: '', isVerified: false, rating: 5 },
        origin: request.fromLocation,
        destination: request.toLocation,
        preferredDate: request.preferredDate,
        preferredTimeFrom: request.preferredTimeFrom,
        preferredTimeTo: request.preferredTimeTo,
        distanceKm: request.distanceKm,
        voucherRequirement: calculateVoucherRequirement(request.distanceKm, request.vehicleType || 'sedan'), // fallback to
        status: request.status,
        createdAt: request.createdAt || new Date().toISOString()
      }));

      setOffers(transformedOffers);
      setRequests(transformedRequests);
      // console.log("testing requests are:", transformedRequests);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch rides');
      console.error('Failed to fetch rides:', err);
    } finally {
      setLoading(false);
    }
  };

  const addOffer = async (offerData: RideOfferForm) => {
    try {
      setLoading(true);
      setError(null);

      // Combine date and time into ISO string format
      const departureDateTime = `${offerData.departureDate}T${offerData.departureTime}:00.000Z`;

      const payload: OfferRidePayload = {
        fromLocation: offerData.origin,
        toLocation: offerData.destination,
        departure: departureDateTime,      // Backend expects this
        departureTime: departureDateTime,  // Backend expects this too
        capacity: offerData.seatCapacity,
        vehicleType: offerData.vehicleType,
        distanceKm: offerData.distanceKm
      };

      const res = await createOfferRide(payload);

      // Add the new offer to the state
      const newOffer: RideOffer = {
        id: res.offer?.id?.toString() || res.id?.toString() || 'temp-' + Date.now(),
        driverId: res.offer?.driverId?.toString() || res.driverId?.toString() || 'unknown',
        driver: res.offer?.driver || { id: 'unknown', name: 'You', email: '', isVerified: false, rating: 5 },
        origin: offerData.origin,
        destination: offerData.destination,
        departureDateTime: departureDateTime,
        vehicleType: offerData.vehicleType,
        seatCapacity: offerData.seatCapacity,
        availableSeats: offerData.seatCapacity,
        distanceKm: offerData.distanceKm,
        voucherRequirement: calculateVoucherRequirement(offerData.distanceKm, offerData.vehicleType),
        status: 'active',
        passengers: [],
        createdAt: new Date().toISOString()
      };

      setOffers(prev => [...prev, newOffer]);

      // Refresh the rides list to get the latest data from backend
      await fetchAllRides();
    } catch (err: any) {
      setError(err.message || 'Failed to create ride offer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addRequest = async (offerData: RideRequestForm) => {
    try {
      setLoading(true);
      setError(null);

      // Fix: Properly format date and time strings
      const payload: RequestRidePayload = {
        fromLocation: offerData.origin,
        toLocation: offerData.destination,
        preferredDate: offerData.preferredDate, // ✅ Use correct field name
        preferredTimeFrom: offerData.preferredTimeFrom, // ✅ Use correct field name
        preferredTimeTo: offerData.preferredTimeTo, // ✅ Use correct field name
        voucherRequired: false,
        distanceKm: offerData.distanceKm
      };
      const res = await createRideRequest(payload);

      const newRequest: RideRequest = {
        id: res.request?.id?.toString() || 'temp-' + Date.now(),
        passengerId: res.request?.userId?.toString() || 'unknown',
        passenger: res.request?.user || { id: 'unknown', name: 'You', email: '', isVerified: false, rating: 5 },
        origin: offerData.origin,
        destination: offerData.destination,
        preferredDate: offerData.preferredDate,
        preferredTimeFrom: offerData.preferredTimeFrom,
        preferredTimeTo: offerData.preferredTimeTo,
        voucherRequirement: calculateVoucherRequirement(offerData.distanceKm, 'sedan'),
        distanceKm: offerData.distanceKm,
        status: 'active',
        createdAt: new Date().toISOString()
      };

      setRequests(prev => [...prev, newRequest]);
    } catch (err: any) {
      setError(err.message || 'Failed to create ride request');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeOffer = (id: string) => {
    setOffers(prev => prev.filter(offer => offer.id !== id));
  };

  const removeRequest = (id: string) => {
    setRequests(prev => prev.filter(request => request.id !== id));
  };

  const joinRide = async (offerId: string) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Implement API call to join ride
      // For now, just update local state
      setOffers(prev => prev.map(offer => {
        if (offer.id === offerId && offer.availableSeats > 0) {
          return {
            ...offer,
            availableSeats: offer.availableSeats - 1
          };
        }
        return offer;
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to join ride');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch rides on mount
  useEffect(() => {
    fetchAllRides();
  }, []);

  return (
    <RidesContext.Provider value={{
      offers,
      requests,
      loading,
      error,
      fetchAllRides,
      addOffer,
      addRequest,
      removeOffer,
      removeRequest,
      joinRide
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