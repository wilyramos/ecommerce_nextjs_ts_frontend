import { verifySession } from '@/src/auth/dal';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiPackage, FiLock, FiLogOut } from 'react-icons/fi';
import { logout } from '@/actions/logout-user-action';

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
    const { user } = await verifySession();
    if (!user) redirect('/auth/login');

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
                <div>
                    {/* Usuario */}
                    <div className="text-center mb-6">
                        <p className="text-lg font-bold text-gray-800">
                            {user.nombre} {user.apellidos}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>

                    {/* Navegación */}
                    <nav className="space-y-2">
                        <Link
                            href="/profile"
                            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-700 transition-all"
                        >
                            <FiUser className="text-lg" />
                            <span>Datos personales</span>
                        </Link>

                        <Link
                            href="/profile/orders"
                            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-700 transition-all"
                        >
                            <FiPackage className="text-lg" />
                            <span>Mis pedidos</span>
                        </Link>

                        <Link
                            href="/profile/password"
                            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-700 transition-all"
                        >
                            <FiLock className="text-lg" />
                            <span>Cambiar contraseña</span>
                        </Link>
                    </nav>
                </div>

                {/* Cerrar sesión */}
                <form action={logout}>
                    <button
                        type="submit"
                        className="flex items-center gap-3 text-red-600 text-sm hover:text-red-800 transition-all"
                    >
                        <FiLogOut className="text-lg" />
                        <span>Cerrar sesión</span>
                    </button>
                </form>
            </aside>

            {/* Contenido principal */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
