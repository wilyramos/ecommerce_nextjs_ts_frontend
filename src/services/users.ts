

import getToken from "../auth/token"
import { UsersAPIResponse } from "../schemas";


interface GetUsersParams {
    page?: number;
    limit?: number;
    nombre?: string;
    email?: string;
    telefono?: string;
    numeroDocumento?: string;
}

export async function getUsers({ page = 1, limit = 25, ...filters }: GetUsersParams) {
    try {

        console.log("Fetching users with filters:", filters, "Page:", page, "Limit:", limit);


        const token = await getToken();
        if (!token) {
            console.error("No token found");
            return null;
        }
        const params = new URLSearchParams();

        if (filters.nombre) {
            params.set("nombre", filters.nombre);
        }
        if (filters.email) {
            params.set("email", filters.email);
        }

        if (filters.telefono) {
            params.set("telefono", filters.telefono);
        }
        if (filters.numeroDocumento) {
            params.set("numeroDocumento", filters.numeroDocumento);
        }
        params.set("page", String(page));
        params.set("limit", String(limit));

        const url = `${process.env.API_URL}/users?${params.toString()}`;

        console.log(`Fetching users from: ${url}`);

        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Error ${res.status}: ${errorText}`);
            return null;
        }

        const data = await res.json();
        return UsersAPIResponse.parse(data);
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        return null;
    }
}