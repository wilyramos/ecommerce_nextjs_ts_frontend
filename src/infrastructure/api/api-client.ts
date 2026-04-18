//File: frontend/src/infrastructure/api/api-client.ts

const BASE_URL = "http://localhost:4000/api";



export const apiClient = async <T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> => {
    console.log(`BASE_URL, Endpoint: ${endpoint}, Options:`, BASE_URL);
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    console.log(`API Request: ${options.method || "GET"} ${endpoint}`, {
        status: response.status,
        statusText: response.statusText,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error en la petición al servidor");
    }

    return response.json();
};