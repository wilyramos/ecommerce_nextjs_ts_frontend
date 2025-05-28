import React from 'react'
import { Search, Filter } from 'lucide-react'
import { getSales } from '@/src/services/sales'

export default async function PageVentas() {

    

    const ventas = await getSales({})

    

    return (
        <section className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                Ventas
            </div>

           
            


        </section>
    )
}