import { cache } from 'react';
import getToken from '../auth/token';
import { CategoryAPIResponse } from "@/src/schemas";
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';


export const getCategory = cache(async (id: string) => {

    const token = (await cookies()).get('ecommerce-token')?.value
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