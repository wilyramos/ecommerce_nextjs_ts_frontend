// frontend/src/lib/http-client.ts

export type HttpOptions = Omit<RequestInit, "headers"> & {
    headers?: Record<string, string>;
    token?: string;
};

export class HttpClient {
    private readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async request<T>(endpoint: string, options: HttpOptions = {}): Promise<T> {
        const { token, headers = {}, ...customConfig } = options;

        const defaultHeaders: Record<string, string> = {
            "Content-Type": "application/json",
            ...headers,
        };

        if (token) {
            defaultHeaders["Authorization"] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            ...customConfig,
            headers: defaultHeaders,
        };

        const response = await fetch(`${this.baseUrl}${endpoint}`, config);

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(
                errorBody?.message || `Error HTTP ${response.status}: ${response.statusText}`
            );
        }

        return (await response.json()) as T;
    }

    get<T>(endpoint: string, options?: HttpOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: "GET" });
    }

    post<T>(endpoint: string, body: unknown, options?: HttpOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    patch<T>(endpoint: string, body?: unknown, options?: HttpOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: "PATCH",
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    delete<T>(endpoint: string, options?: HttpOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: "DELETE" });
    }
}

export const apiHttpClient = new HttpClient(
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
);