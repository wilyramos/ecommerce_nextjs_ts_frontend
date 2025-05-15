import getToken from "../auth/token"
import { ProductsAPIResponse, ProductAPIResponse } from "@/src/schemas";
import { ProductAPIResponseList } from "@/src/schemas/index";





export const getProducts = async ({ page = 1, limit = 5 }) => {

    // const token = getToken();
    const url = `${process.env.API_URL}/products?page=${page}&limit=${limit}`;

    const req = await fetch(url, {
        method: 'GET'
    });

    const json = await req.json();
    // console.log("jssson", json);
    if (!req.ok) {
        return null;
    }

    const products = ProductsAPIResponse.parse(json);
    // console.log("son los productos", products);
    return products;
}

export const getProduct = async (id: string) => {
    const token = getToken();
    const url = `${process.env.API_URL}/products/${id}`;

    const req = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const json = await req.json();
    if (!req.ok) {
        return null;
    }

    const product = ProductAPIResponse.parse(json);
    return product;
}

export const getProductsHomePage = async ({ page, limit, category, priceRange }: {
    page: number;
    limit: number;
    category: string;
    priceRange: string;
}) => {
    // const token = getToken();
    const url = `${process.env.API_URL}/products/filter?page=${page}&limit=${limit}&category=${category}&priceRange=${priceRange}`;

    const req = await fetch(url, {
        method: 'GET'
    });
    if (!req.ok) {
        return null;
    }

    const json = await req.json();
    // console.log("jssson", json);
    

    const products = ProductAPIResponseList.parse(json);
    // console.log("son los productos", products);
    return products;
}