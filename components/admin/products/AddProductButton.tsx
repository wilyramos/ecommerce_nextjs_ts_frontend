'use client';

import { useRouter } from 'next/navigation';
import { FiPlus } from 'react-icons/fi'; // Ícono moderno de "agregar"

export default function AddProductButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push('/admin/products/new')}
            className="flex items-center gap-2 bg-blue-800  hover:bg-blue-900 text-white text-sm px-4 py-2 rounded-full shadow-md transition-all duration-200"
        >
            <FiPlus className="text-base" />
            Nuevo producto
        </button>
    );
}
