"use server"

import getToken from "@/src/auth/token";
import { ImageSchema } from "@/src/schemas";


export async function uploadImageBrand(formData: FormData) {

    const token = await getToken();

    const url = `${process.env.API_URL}/brands/upload-image`;
    const req = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    

    const images = await req.json();
    console.log(images);
    const success = ImageSchema.parse(images);

    return success;
}