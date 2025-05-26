import getToken from "../auth/token"



export const getOrders = async ({ page = 1, limit = 10 }) => {

    const token = getToken();
    const url = `${process.env.API_URL}/orders?page=${page}&limit=${limit}`;

    const req = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    console.log("Orders Request:", req);
    if (!req.ok) {
        return null;
    }

    const json = await req.json();
    console.log("Orders JSON:", json);
    return json; // Assuming the response is already in the desired format

}
