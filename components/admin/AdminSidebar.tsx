import { User } from '@/src/schemas';
import Image from 'next/image';
import Link from 'next/link';
import AdminMenu from "@/components/admin/AdminMenu";
import { FaHome, FaBoxOpen, FaTags, FaUsers, FaReceipt, FaCashRegister } from "react-icons/fa";

export default function AdminSidebar({ user }: { user: User }) {
    
    const isAdmin = user.rol === 'administrador';
    const isVendedor = user.rol === 'vendedor';

    return (
        <aside className="flex flex-col w-20 sm:w-64 h-screen bg-gray-900 text-white">
            <div className="flex items-center justify-center py-6 border-b border-gray-800">
                <Image
                    src="/logo-w.svg"
                    alt="Logo"
                    width={50}
                    height={50}
                    priority
                    className="w-24 h-auto"
                />
            </div>

            <nav className="flex flex-col p-4 space-y-2 text-sm font-medium">
                {isAdmin && (
                    <>
                        <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800">
                            <FaHome /> Dashboard
                        </Link>
                        <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800">
                            <FaBoxOpen /> Productos
                        </Link>
                        <Link href="/admin/products/category" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800">
                            <FaTags /> Categorías
                        </Link>
                        <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800">
                            <FaReceipt /> Órdenes
                        </Link>
                        <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800">
                            <FaUsers /> Usuarios
                        </Link>
                    </>
                )}

                {(isAdmin || isVendedor) && (
                    <Link
                        href={isAdmin ? "/admin/pos" : "/vendedor/pos"}
                        className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800"
                    >
                        <FaCashRegister /> Punto de Venta
                    </Link>
                )}
            </nav>

            <div className="flex-grow" />

            <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-t border-gray-700">
                <p className="text-sm">
                    Hola <span className="font-bold text-blue-400">{user.nombre}</span>
                </p>
                <AdminMenu user={user} />
            </div>
        </aside>
    );
}