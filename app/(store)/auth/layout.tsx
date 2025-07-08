import ToastNotification from '@/components/ui/ToastNotification'
import React from 'react'
import { getCurrentUser } from '@/src/auth/currentUser'
import { redirect } from 'next/navigation'


export default async function layoutAuth({ children }: { children: React.ReactNode }) {

    // Verifica si el usuario está autenticado
    const user = await getCurrentUser();
    // console.log("Usuario actual:", user);

    if (user) {
        // Si el usuario está autenticado, redirige a la página de inicio
        redirect('/profile')
    }

    return (
        <>
            <div className='flex flex-col items-center justify-center'>
                <div className='w-full max-w-md py-20 flex-1 '>
                    {children}
                </div>
            </div>
            <ToastNotification />
        </>
    )
}