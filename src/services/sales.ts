import "server-only";


import getToken from "../auth/token";
import { SaleResponsePopulate, SalesAPIResponse } from "@/src/schemas";
import { format } from 'date-fns';


interface GetSalesParams {
    search?: string;
    fechaInicio?: string;
    fechaFin?: string;
    page?: number;
    limit?: number;
}

export const getSale = async (id: string) => {
    try {
        const token = await getToken();
        const url = `${process.env.API_URL}/sales/${id}`;

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
        const saleData = SaleResponsePopulate.parse(json);
        return saleData;

    } catch (error) {
        console.error("Error fetching sale:", error);
        return null;
    }
};

export const getSales = async (params: GetSalesParams) => {
    try {
        const token = await getToken();
        let { fechaInicio, fechaFin } = params;
        const { search } = params;
        const { page = 1, limit = 10 } = params;
        // 📌 Si no viene rango, poner el día actual
        if (!fechaInicio && !fechaFin) {
            const today = format(new Date(), 'yyyy-MM-dd');
            fechaInicio = today;
            fechaFin = today;
        }

        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (fechaInicio) queryParams.append('fechaInicio', fechaInicio);
        if (fechaFin) queryParams.append('fechaFin', fechaFin);
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

        const url = `${process.env.API_URL}/sales/report/summary?${queryParams.toString()}`;

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


type TopProductsResponse = {
    topProducts: {
        productId: string;
        nombre: string;
        margin: number;
        totalQuantity: number;
        totalSales: number;
    }[];
};

export const getTopProducts = async (params: GetSalesParams) => {
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

        const url = `${process.env.API_URL}/sales/report/top-products?${queryParams.toString()}`;
        console.log("Fetching top products from:", url);
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

        // parse the response
        const topProducts: TopProductsResponse = json;
        return topProducts.topProducts;


    } catch (error) {
        console.error("Error fetching top products:", error);
        return null;
    }
}


export interface VendorReport {
    totalUnits: number;     // unidades vendidas
    totalSales: number;     // monto total de ventas
    numSales: number;       // cantidad de ventas realizadas
    margin: number;         // margen de ganancia
    employeeId: string;     // id del vendedor
    nombre: string;         // nombre del vendedor
}

// la forma de la respuesta completa
export interface VendorReportResponse {
    report: VendorReport[];
}


export const getReportByVendors = async (
    params: GetSalesParams
) => {
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
        if (fechaInicio) queryParams.append("fechaInicio", fechaInicio);
        if (fechaFin) queryParams.append("fechaFin", fechaFin);

        const url = `${process.env.API_URL}/sales/report/vendors?${queryParams.toString()}`;

        const req = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!req.ok) {
            console.error("Error en la respuesta:", req.statusText);
            return null;
        }

        const json: VendorReportResponse = await req.json();
        console.log("Vendor report response:", json);
        return json;
    } catch (error) {
        console.error("Error fetching vendor report:", error);
        return null;
    }
};
