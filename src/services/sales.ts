import getToken from "../auth/token"
import { SalesAPIResponse } from "@/src/schemas"

interface GetSalesParams {
    search?: string;
    fechaInicio?: string;
    fechaFin?: string;
    page?: number;
    limit?: number;
}

export const getSales = async (params: GetSalesParams) => {
    try {
        const token = await getToken();
        const { search, fechaInicio, fechaFin, page = 1, limit = 10 } = params;

        const queryParams = new URLSearchParams();
        if (search) {
            queryParams.append('search', search);
        }
        if (fechaInicio) {
            queryParams.append('fechaInicio', fechaInicio);
        }
        if (fechaFin) {
            queryParams.append('fechaFin', fechaFin);
        }
        queryParams.append('page', page.toString());
        queryParams.append('limit', limit.toString());

        const url = `${process.env.API_URL}/sales?${queryParams.toString()}`;


        const req = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!req.ok) {
            console.error("Error en la respuesta:", req.statusText);
            return null;
        }

        const json = await req.json();
        // console.log("JSON response:", json);
        const salesData = SalesAPIResponse.parse(json);
        // console.log("Sales data:", salesData);
        return salesData;

    } catch (error) {
        console.error("Error fetching sales:", error);
        return null;
    }
};
