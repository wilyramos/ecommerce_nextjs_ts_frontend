/* File: frontend/src/actions/auth-actions.ts 
    @Author: whramos 
    @Date: 11-04-2024
    @Last Modified by: whramos
    @Last Modified time: 11-04-2024
*/

"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";


/**
 * 2. CERRAR SESIÓN (LOGOUT)
 */
export async function logoutAction(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete('ecommerce-token');
    redirect('/auth/login');
}