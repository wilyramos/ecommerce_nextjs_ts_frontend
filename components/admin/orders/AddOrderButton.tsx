'use client';

import { useRouter } from 'next/navigation';
import { FiPlus } from 'react-icons/fi';
import { Button } from '@/components/ui/button';


export default function AddOrderButton() {


    const router = useRouter();

    return (
        <Button
            variant="default"
            size="sm"
            onClick={() => router.push('/admin/orders/add')}
        >
            <FiPlus className="mr-2" />
            Añadir Pedido
        </Button>
    )
}
