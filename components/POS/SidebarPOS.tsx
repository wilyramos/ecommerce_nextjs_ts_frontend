import { User } from '@/src/schemas';
import Link from 'next/link';
import {
    FaUserCircle,
    FaCashRegister,
    FaReceipt,
    FaBoxOpen,
    FaUsers,
    FaSignOutAlt,
} from 'react-icons/fa';

export default function SidebarPOS({ user }: { user: User }) {
    return (
        <aside className="w-64 h-screen bg-white border-r shadow-sm flex flex-col">
            {/* Usuario */}
            <div className="flex items-center gap-3 p-4 border-b bg-gray-50">
                <FaUserCircle className="text-2xl text-gray-500" />
                <div>
                    <p className="text-sm text-gray-600">Bienvenido</p>
                    <p className="text-sm font-semibold text-gray-800">{user.nombre}</p>
                </div>
            </div>

            {/* Navegación */}
            <nav className="flex flex-col p-4 space-y-2 text-gray-700 text-sm font-medium flex-1">
                <Link href="/pos" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100">
                    <FaCashRegister /> Inicio
                </Link>
                <Link href="/pos/ventas" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100">
                    <FaReceipt /> Ventas Realizadas
                </Link>
                <Link href="/pos/productos" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100">
                    <FaBoxOpen /> Productos
                </Link>
                <Link href="/pos/clientes" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100">
                    <FaUsers /> Clientes
                </Link>
            </nav>

            {/* Salir */}
            <div className="p-4 border-t">
                <button className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition">
                    <FaSignOutAlt /> Cerrar sesión
                </button>
            </div>
        </aside>
    );
}
