import api from "../index";

export interface RequestRidePayload {
    origin: string;
    destination: string;
    departureWindowStart: string; // e.g. "15:30"
    departureWindowEnd: string;   // e.g. "16:15"
    kilometerCount: number;
}

export const createRideRequest = async (_data: RequestRidePayload) => {
    // TODO: Implement ride requests in backend
    console.warn("Ride requests not implemented in backend yet");
    return { message: "Ride request functionality coming soon" };
};

export const getAllRideRequests = async () => {
    // TODO: Implement ride requests in backend
    console.warn("Ride requests not implemented in backend yet");
    return [];
};

export const getRideRequestById = async (id: string) => {
    const res = await api.get(`/rides/requests/${id}`);
    return res.data;
};
