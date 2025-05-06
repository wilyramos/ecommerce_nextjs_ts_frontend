import { verifySession } from '@/src/auth/dal'
import React from 'react'

export default async function AdminPage() {


    await verifySession();


    return (
        <div>AdminPage</div>
    )
}
