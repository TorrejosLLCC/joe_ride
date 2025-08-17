import api from "../index";

export interface RatingPayload {
    rideId: string;
    rating: number;  // 1-5
    comment?: string;
}

export const submitRating = async (data: RatingPayload) => {
    const res = await api.post("/ratings", data);
    return res.data;
};

export const getUserRatings = async (userId: string) => {
    const res = await api.get(`/users/${userId}/ratings`);
    return res.data;
};
