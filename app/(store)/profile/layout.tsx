import { verifySession } from '@/src/auth/dal';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiPackage, FiLock, FiLogOut } from 'react-icons/fi';
import { logout } from '@/actions/logout-user-action';

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
    const { user } = await verifySession();
    if (!user) redirect('/auth/login');

    return (
        <div className="flex">
            {/* Sidebar lateral */}
            <aside className="w-64 shrink-0 border-r bg-white p-6 space-y-8">
                <div className="text-center">
                    <p className="font-semibold">{user.nombre} {user.apellidos}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>

                <nav className="space-y-4">
                    <Link href="/profile" className="flex items-center gap-2 text-sm hover:underline">
                        <FiUser />
                        <span>Datos personales</span>
                    </Link>
                    <Link href="/profile/orders" className="flex items-center gap-2 text-sm hover:underline">
                        <FiPackage />
                        <span>Mis pedidos</span>
                    </Link>
                    <Link href="/profile/password" className="flex items-center gap-2 text-sm hover:underline">
                        <FiLock />
                        <span>Cambiar contraseña</span>
                    </Link>

                    <form action={logout}>
                        <button type="submit" className="flex items-center gap-2 text-sm text-red-500 hover:underline">
                            <FiLogOut />
                            <span>Cerrar sesión</span>
                        </button>
                    </form>
                </nav>
            </aside>

            {/* Contenido principal */}
            <main className="flex-1 p-6 bg-gray-50">
                <h1 className="text-xl font-semibold mb-6">Mi Perfil</h1>
                {children}
            </main>
        </div>
    );
}
