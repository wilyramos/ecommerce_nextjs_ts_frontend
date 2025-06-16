import { User } from '@/src/schemas';
import Image from 'next/image';
import Link from 'next/link';
import AdminMenu from "@/components/admin/AdminMenu";
import { FaHome, FaBoxOpen, FaTags, FaUsers, FaReceipt, FaCashRegister } from "react-icons/fa";

export default function AdminSidebar({ user }: { user: User }) {
    
    const isAdmin = user.rol === 'administrador';
    // const isVendedor = user.rol === 'vendedor';

    return (
        <aside className="fixed top-0 left-0 w-48 h-full bg-gray-900 text-white shadow-lg flex flex-col">
            <div className="flex items-center justify-center py-6 border-b border-gray-800">
                <Image
                    src="/logow.svg"
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

                {(isAdmin) && (
                    <Link
                        href="/pos"
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