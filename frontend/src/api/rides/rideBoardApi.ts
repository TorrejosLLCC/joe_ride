import api from "../index";

// Payload for filtering ride board (optional)
export interface RideBoardFilter {
    origin?: string;
    destination?: string;
    departureTime?: string; // e.g. "15:30"
    date?: string; // e.g. "2025-08-16"
}

// Single ride board entry
export interface RideBoardEntry {
    id: string;
    origin: string;
    destination: string;
    departureDate: string;
    departureTime: string;
    passengerName: string;
    kilometerCount: number;
    status: "OPEN" | "MATCHED" | "CLOSED";
    createdAt: string;
    updatedAt: string;
}

// Fetch all available rides on the board
export const getAllRideBoardEntries = async () => {
    const res = await api.get<RideBoardEntry[]>("/ride-board");
    return res.data;
};

// Fetch filtered rides
export const getFilteredRideBoardEntries = async (filters: RideBoardFilter) => {
    const res = await api.get<RideBoardEntry[]>("/ride-board", {
        params: filters,
    });
    return res.data;
};

// Fetch single ride board entry
export const getRideBoardEntryById = async (id: string) => {
    const res = await api.get<RideBoardEntry>(`/ride-board/${id}`);
    return res.data;
};

// (Optional) Remove ride from board (e.g., if passenger cancels)
export const removeRideBoardEntry = async (id: string) => {
    const res = await api.delete(`/ride-board/${id}`);
    return res.data;
};
