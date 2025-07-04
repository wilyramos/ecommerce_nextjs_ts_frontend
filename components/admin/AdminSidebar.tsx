import { User } from '@/src/schemas';
import Image from 'next/image';
import Link from 'next/link';
import AdminMenu from '@/components/admin/AdminMenu';
import {
    FaHome,
    FaBoxOpen,
    FaTags,
    FaUsers,
    FaReceipt,
    FaCashRegister,
} from 'react-icons/fa';

export default function AdminSidebar({ user }: { user: User }) {
    const isAdmin = user.rol === 'administrador';

    const links = [
        { href: '/admin', icon: <FaHome />, label: 'Dashboard' },
        { href: '/admin/products', icon: <FaBoxOpen />, label: 'Productos' },
        { href: '/admin/products/category', icon: <FaTags />, label: 'Categorías' },
        { href: '/admin/orders', icon: <FaReceipt />, label: 'Órdenes' },
        { href: '/admin/users', icon: <FaUsers />, label: 'Usuarios' },
        { href: '/pos', icon: <FaCashRegister />, label: 'Punto de Venta' },
    ];

    return (
        <aside className="fixed top-0 left-0 h-full w-44 bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="py-6 flex justify-center border-b border-gray-100">
                <Image src="/logob.svg" alt="Logo" width={90} height={90}  />
            </div>

            {/* Navegación */}
            <nav className="flex flex-col p-3 text-sm space-y-2">
                {links.map(
                    (link) =>
                        (isAdmin || link.href === '/pos') && (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition"
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        )
                )}
            </nav>

            {/* Espaciador */}
            <div className="flex-grow" />

            {/* Usuario */}
            <div className=" flex flex-col px-4 py-4 border-t border-gray-100 text-sm">
                <p className="mb-1 text-gray-500">Hola, <span className="font-medium text-blue-500">{user.nombre}</span></p>
                <AdminMenu user={user} />
            </div>
        </aside>
    );
}
