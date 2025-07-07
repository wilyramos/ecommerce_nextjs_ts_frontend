// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
    return (
        <>
            <div className="flex flex-col items-center justify-center p-10">
                <h1 className="text-4xl font-bold text-gray-800">404 - Página no encontrada</h1>
                <p className="text-gray-500 mt-3 max-w-md">
                    Lo sentimos, no pudimos encontrar la página que estás buscando.
                </p>
                <Link
                    href="/"
                    className="mt-6 inline-block bg-gray-900 text-white px-5 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                    Volver al inicio
                </Link>
            </div>
        </>
    );
}