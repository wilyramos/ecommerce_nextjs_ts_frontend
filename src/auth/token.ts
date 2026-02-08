//File: frontend/src/auth/token.ts

import { cookies } from "next/headers";

export default async function getToken() {
    const token = (await cookies()).get('ecommerce-token')?.value
    return token
}