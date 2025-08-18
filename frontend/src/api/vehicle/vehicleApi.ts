import api from "../index";

export interface VehiclePayload {
    make: string;
    model: string;
    plateNumber: string;
    capacity: number;
}

export const addVehicle = async (data: VehiclePayload) => {
    const res = await api.post("/vehicles", data);
    return res.data;
};

export const getUserVehicles = async (userId: string) => {
    const res = await api.get(`/users/${userId}/vehicles`);
    return res.data;
};

export const deleteVehicle = async (id: string) => {
    const res = await api.delete(`/vehicles/${id}`);
    return res.data;
};
