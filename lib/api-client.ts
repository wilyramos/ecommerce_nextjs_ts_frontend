//File: frontend/lib/api-client.ts

import getToken from "@/src/auth/token";

const BASE_URL = process.env.API_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const token = await getToken();

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}