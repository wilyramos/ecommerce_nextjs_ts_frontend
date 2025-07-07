import { verifySession } from '@/src/auth/dal';
import { redirect } from 'next/navigation';
import { logout } from '@/actions/logout-user-action';
import { FiLogOut } from 'react-icons/fi';
import SidebarProfileNav from '@/components/profile/SidebarProfileNav';

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
    const { user } = await verifySession();
    if (!user) redirect('/auth/login');

    return (
        <div className="flex h-auto">
            {/* Sidebar */}
            <aside className="w-auto bg-white shadow-md p-6 flex flex-col justify-between">
                <div>
                    {/* Usuario */}
                    <div className="text-center mb-6">
                        <p className="text-lg font-bold text-gray-800">
                            {user.nombre} {user.apellidos}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>

                    {/* Navegación */}
                    <SidebarProfileNav />
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