import api from "../index";

export interface RequestRidePayload {
    fromLocation: string;
    toLocation: string;
    preferredDate: string;
    preferredTimeFrom: string;
    preferredTimeTo: string;
    voucherRequired: boolean;
    distanceKm: number;
  }

export const createRideRequest = async (data: RequestRidePayload) => {
    const userId = localStorage.getItem("userId");

    console.log(userId);

    if (!userId) {
        throw new Error("No userId found in localStorage. Please login first.");
    }
    
    const res = await api.post("ride-requests", data, {
        headers: {
            "x-user-id": userId
        },
    });
    return res.data;
};

export const getAllRideRequests = async () => {
    const res = await api.get("/ride-requests");
    return res.data;
};

// export const getRideRequestById = async (id: string) => {
//     const res = await api.get(`/ride-requests/${id}`);
//     return res.data;
// };
