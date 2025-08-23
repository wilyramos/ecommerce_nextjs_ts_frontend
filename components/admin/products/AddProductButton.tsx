'use client';

import { useRouter } from 'next/navigation';
import { FiPlus } from 'react-icons/fi'; 

export default function AddProductButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push('/admin/products/new')}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg font-medium shadow-sm hover:bg-blue-700 hover:shadow transition-colors cursor-pointer"
        >
            <FiPlus className="h-4 w-4" />
            Nuevo producto
        </button>
    );
}
