import api from "../index";

export interface OfferRidePayload {
    driverId?: string; // Optional fallback for testing
    fromLocation: string;
    toLocation: string;
    departureTime: string; // ISO date string
    capacity: number;
    pricePerSeat?: number;
    voucherRequired: number;
    vehicleType: string;
    distanceKm: number;
}

export const createOfferRide = async (data: OfferRidePayload) => {
    const res = await api.post("/ride-offers", data);
    return res.data;
};

export const getAllRideOffers = async () => {
    const res = await api.get("/ride-offers");
    return res.data;
};
