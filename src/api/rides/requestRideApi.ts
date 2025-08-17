import api from "../index";

export interface RequestRidePayload {
    origin: string;
    destination: string;
    departureWindowStart: string; // e.g. "15:30"
    departureWindowEnd: string;   // e.g. "16:15"
    kilometerCount: number;
}

export const createRideRequest = async (data: RequestRidePayload) => {
    const res = await api.post("/rides/request", data);
    return res.data;
};

export const getAllRideRequests = async () => {
    const res = await api.get("/rides/requests");
    return res.data;
};

export const getRideRequestById = async (id: string) => {
    const res = await api.get(`/rides/requests/${id}`);
    return res.data;
};
