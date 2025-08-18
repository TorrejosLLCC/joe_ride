import api from "../index";

export interface OfferRidePayload {
    origin: string;
    destination: string;
    departureDate: string;
    departureTime: string;
    capacity: number;
    vehicleType: string;
    kilometerCount: number;
}

export const createOfferRide = async (data: OfferRidePayload) => {
    const res = await api.post("/rides/offer", data);
    return res.data;
};

export const getAllRideOffers = async () => {
    const res = await api.get("/rides/offers");
    return res.data;
};
