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
        console.log("JSON response:", json);
        const salesData = SalesAPIResponse.parse(json);
        console.log("Sales data:", salesData);
        return salesData;

    } catch (error) {
        console.error("Error fetching sales:", error);
        return null;
    }
};

type SummaryResponse = {
    summary: {
        totalSales: number;
        numberSales: number;
        totalUnitsSold: number;
        margin: number;
    };
};

export const getSummarySales = async (params: GetSalesParams) => {

    try {
        const token = await getToken();
        let { fechaInicio, fechaFin } = params;

        const getDate = (daysAgo = 0) => {
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            return date.toISOString().split("T")[0];
        };

        if (!fechaInicio) fechaInicio = getDate(7);
        if (!fechaFin) fechaFin = getDate(0);


        const queryParams = new URLSearchParams();
        if (fechaInicio) {
            queryParams.append('fechaInicio', fechaInicio);
        }
        if (fechaFin) {
            queryParams.append('fechaFin', fechaFin);
        }

        const url = `${process.env.API_URL}/sales/report?${queryParams.toString()}`;

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
        const summaryData: SummaryResponse = json;
        return summaryData.summary;

    } catch (error) {
        console.error("Error fetching sales summary:", error);
        return null;
    }
}


type SalesMetricsResponse = {
    report: {
        label: string;
        ventas: number;
        cantidadVentas: number;
        unidadesVendidas: number;
    }[];
};

export const getMetricsSales = async (params: GetSalesParams) => {
    try {
        const token = await getToken();
        let { fechaInicio, fechaFin } = params;

        const getDate = (daysAgo = 0) => {
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            return date.toISOString().split("T")[0];
        };

        if (!fechaInicio) fechaInicio = getDate(7);
        if (!fechaFin) fechaFin = getDate(0);
        const queryParams = new URLSearchParams();
        if (fechaInicio) {
            queryParams.append('fechaInicio', fechaInicio);
        }
        if (fechaFin) {
            queryParams.append('fechaFin', fechaFin);
        }

        const url = `${process.env.API_URL}/sales/report/metrics?${queryParams.toString()}`;
        const req = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!req.ok) {
            console.error("Error en la respuesta:", req.statusText);
            return null;
        }
        const json = await req.json();
        const metricsData: SalesMetricsResponse = json;
        return metricsData.report;
    } catch (error) {
        console.error("Error fetching sales metrics:", error);
        return null;
    }
}