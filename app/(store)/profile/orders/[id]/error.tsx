// File: app/(store)/profile/orders/error.tsx
'use client'; 



import { useEffect } from 'react';

type Props = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function Error({ error, reset }: Props) {
    useEffect(() => {
        console.error('Error en orders:', error);
    }, [error]);

    return (
        <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-red-600">¡Ocurrió un error!</h2>
            <p className="text-gray-500 mt-2">{error.message}</p>
            <button
                onClick={reset}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Reintentar
            </button>
        </div>
    );
}
