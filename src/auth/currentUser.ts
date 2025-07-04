//src/auth/currentUser.ts
import "server-only";
import { UserSchema } from "../schemas";
import getToken from "./token";

export async function getCurrentUser() {
    const token = await getToken();
    // console.log("Token:", token);
    if (!token) return null;

    const url = `${process.env.API_URL}/auth/user`;
    const req = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    const Response = await req.json()
    // console.log("Response:", Response);
    const ResponseValidation = UserSchema.safeParse(Response);
    // console.log("ResponseValidation:", ResponseValidation);
    if (!ResponseValidation.success) {
        return null
    }
    return ResponseValidation.data;
}