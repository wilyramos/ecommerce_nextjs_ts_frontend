import { verifySession } from '@/src/auth/dal';
import { redirect } from 'next/navigation';
import { logout } from '@/actions/logout-user-action';
import { FiLogOut } from 'react-icons/fi';
import SidebarProfileNav from '@/components/profile/SidebarProfileNav';

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
    const { user } = await verifySession();
    if (!user) redirect('/auth/login');

    return (
        <div className="flex flex-col md:flex-row ">
            {/* Sidebar */}
            <aside className="w-full md:w-auto bg-white p-6 flex flex-col justify-between">
                <div>
                    {/* Usuario */}
                    <div className="text-center mb-6">
                        <p className="text-lg font-bold text-gray-800">
                            {user.nombre} {user.apellidos}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>

                        <form action={logout}>
                            <button
                                type="submit"
                                className="flex items-center gap-3 text-red-600 text-sm hover:text-red-800 transition-all p-6 cursor-pointer"
                            >
                                <FiLogOut className="text-lg" />
                                <span>Cerrar sesión</span>
                            </button>
                        </form>
                    </div>
                    {/* Navegación */}
                    <SidebarProfileNav />
                </div>
                {/* Cerrar sesión */}
            </aside>
            {/* Contenido principal */}
            <main className="flex-1 p-8 min-h-screen">
                {children}
            </main>
        </div>
    );
}
