import { User } from '@/src/schemas';
import Image from 'next/image';
import Link from 'next/link';
import AdminMenu from "@/components/admin/AdminMenu";

export default function AdminSidebar({ user }: { user: User }) {
    return (
        <aside className="flex flex-col w-64 h-screen bg-gray-800 text-white shadow-lg">
            {/* Logo */}
            <div className="flex items-center justify-center py-6 border-b border-gray-700">
                <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={50}
                    height={50}
                    priority
                    className="w-24 h-auto"
                />
                {/* <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={50}
                    height={50}
                    priority
                    className="h-15 w-auto"
                /> */}
            </div>

            {/* Navegación */}
            <nav className="flex flex-col px-6 py-4 space-y-3 text-sm font-medium">
                <Link href="/admin" className="hover:bg-gray-700 rounded px-3 py-2 transition">
                    🏠 Home
                </Link>
                <Link href="/admin/products" className="hover:bg-gray-700 rounded px-3 py-2 transition">
                    📦 Products
                </Link>
                <Link href="/admin/products/category" className="hover:bg-gray-700 rounded px-3 py-2 transition">
                    🗂️ Categories
                </Link>
                <Link href="/admin/orders" className="hover:bg-gray-700 rounded px-3 py-2 transition">
                    🧾 Orders
                </Link>
                <Link href="/admin/users" className="hover:bg-gray-700 rounded px-3 py-2 transition">
                    👥 Users
                </Link>
            </nav>

            {/* Spacer */}
            <div className="flex-grow" />

            {/* Usuario */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-t border-gray-700">
                <p className="text-sm">
                    Hola <span className="font-bold text-blue-400">{user.nombre}</span>
                </p>
                <AdminMenu user={user} />
            </div>
        </aside>
    );
}
