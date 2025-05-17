import Link from "next/link";
import { User } from "@/src/schemas";




export default function AdminSidebarMobil({ user }: { user: User }) {
    return (
       <>

            <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
                <h1 className="font-light">Admin Panel <span className="text-gray-400">{user.nombre}</span></h1>
                <Link href="/admin" className="text-sm">Cerrar sesión</Link>
            </div>
            <nav className="flex flex-col p-4 space-y-2">
                <Link href="/admin/products" className="text-gray-700 hover:text-gray-900">Productos</Link>
                <Link href="/admin/categories" className="text-gray-700 hover:text-gray-900">Categorías</Link>
                <Link href="/admin/users" className="text-gray-700 hover:text-gray-900">Usuarios</Link>
            </nav>
       </>
    )
}
