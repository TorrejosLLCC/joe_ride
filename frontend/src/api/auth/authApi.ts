import api from "../index";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
}

export const login = async (data: LoginPayload) => {
    const res = await api.post("/auth/login", data);
    return res.data;
};

export const register = async (data: RegisterPayload) => {
    const res = await api.post("/auth/register", data);
    return res.data;
};

export const logout = async () => {
    const res = await api.post("/auth/logout");
    return res.data;
};


export const getCurrentUser = async (token: string) => {
    const response = await fetch(`${api}/auth/me`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json();
};