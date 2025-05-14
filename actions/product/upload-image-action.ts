"use server"

import getToken from "@/src/auth/token"
import { ImageSchemaResponse } from "@/src/schemas"


export async function uploadImage( formData: FormData) {

    const token = await getToken();
    
    const url = `${process.env.API_URL}/products/upload-images`;
    const req = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const images = await req.json();
    const success = ImageSchemaResponse.parse(images);

    return success;
}