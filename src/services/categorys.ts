import { cache } from 'react';
import getToken from '../auth/token';
import { CategoryAPIResponse, CategoriesAPIResponse } from "@/src/schemas";
import { notFound } from 'next/navigation';


export const getCategory = cache(async (id: string) => {

    const token = getToken();
    const url = `${process.env.API_URL}/category/${id}`;

    const req = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const json = await req.json();
    if (!req.ok) {
        notFound();
    }

    const category = CategoryAPIResponse.parse(json);
    return category;
});


export const getCategories = cache(async () => {
    const url = `${process.env.API_URL}/category/list`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const json = await res.json();
    const categories = CategoriesAPIResponse.parse(json);
    return categories;
});
