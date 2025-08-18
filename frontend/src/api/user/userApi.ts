import api from "../index";

export interface UpdateUserPayload {
    name?: string;
    email?: string;
    phone?: string;
}

export const getUserById = async (id: string) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
};

export const updateUser = async (id: string, data: UpdateUserPayload) => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
};

export const deleteUser = async (id: string) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
};
