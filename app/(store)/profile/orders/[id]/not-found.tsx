// app/(store)/profile/orders/[id]/not-found.tsx
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="text-center py-20">
            <h1 className="text-xl font-semibold text-gray-700">Pedido no encontrado</h1>
            <p className="text-gray-500 mb-4">Es posible que el pedido haya sido eliminado o el enlace sea incorrecto.</p>
            <Link href="/profile/orders" className="text-blue-600 underline">Volver a mis pedidos</Link>
        </div>
    );
}
