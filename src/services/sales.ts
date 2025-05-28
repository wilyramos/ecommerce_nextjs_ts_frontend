import getToken from "../auth/token"



interface GetSalesParams {
    search?: string;
    fechaInicio?: string;
    fechaFin?: string;
    page?: number;
    limit?: number;
}

export const getSales = async (params: GetSalesParams) => {
    try {
        const token = getToken();
        const { search, fechaInicio, fechaFin, page = 1, limit = 10 } = params;
        const queryParams = new URLSearchParams({
            ...(search && { search }),
            ...(fechaInicio && { fechaInicio }),
            ...(fechaFin && { fechaFin }),
            page: page.toString(),
            limit: limit.toString(),
        });
        const url = `${process.env.API_URL}/sales?${queryParams.toString()}`;

        const req = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("reqqq",req)

        if (!req.ok) {
            return null;
        }

        const json = await req.json();
        console.log("jssssonnn", json)
        return json;

    } catch (error) {
        console.error("Error fetching sales:", error);
        return null;
    }
};
