import { createContext, useContext, useState, useEffect, type FC } from "react";
import { createOfferRide, getAllRideOffers, type OfferRidePayload } from "../api/rides/offerRideApi";
// import { createRideRequest, type RequestRidePayload } from "../api/rides/requestRideApi";
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

      // For now, set empty requests array since endpoint doesn't exist
      const transformedRequests: RideRequest[] = [];

      setOffers(transformedOffers);
      setRequests(transformedRequests);
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

  const addRequest = async (_requestData: RideRequestForm) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Backend ride request endpoint is not implemented yet
      // For now, just show a message to the user
      throw new Error("Ride requests are not implemented in the backend yet. Please check back later!");

      // This code will be enabled when backend is ready:
      // const payload: RequestRidePayload = {
      //   origin: requestData.origin,
      //   destination: requestData.destination,
      //   departureWindowStart: requestData.preferredDepartureTimeStart,
      //   departureWindowEnd: requestData.preferredDepartureTimeEnd,
      //   kilometerCount: requestData.distanceKm
      // };

      // const res = await createRideRequest(payload);
      
      // const newRequest: RideRequest = {
      //   id: res.id,
      //   passengerId: res.passengerId || res.userId,
      //   passenger: res.passenger || { id: res.passengerId || res.userId, name: 'You', email: '', isVerified: false, rating: 5 },
      //   origin: requestData.origin,
      //   destination: requestData.destination,
      //   preferredDepartureStart: requestData.preferredDepartureTimeStart,
      //   preferredDepartureEnd: requestData.preferredDepartureTimeEnd,
      //   distanceKm: requestData.distanceKm,
      //   voucherRequirement: calculateVoucherRequirement(requestData.distanceKm, 'sedan'),
      //   status: 'active',
      //   createdAt: new Date().toISOString()
      // };

      // setRequests(prev => [...prev, newRequest]);
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