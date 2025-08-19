import api from "../index";

export interface OfferRidePayload {
    fromLocation: string;
    toLocation: string;
    departure: string;
    departureTime: string;
    capacity: number;
    vehicleType: string;
    distanceKm: number;
}

export const createOfferRide = async (data: OfferRidePayload) => {
    const userId = localStorage.getItem("userId");

    console.log(userId);

    if (!userId) {
        throw new Error("No userId found in localStorage. Please login first.");
    }

    const res = await api.post("/ride-offers", data, {
        headers: {
            "x-user-id": userId
        },
    });
    return res.data;
};

export const getAllRideOffers = async () => {
    const res = await api.get("/ride-offers");
    return res.data;
};
