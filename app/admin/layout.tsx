import AdminMenu from "@/components/admin/AdminMenu";
import Logo from "@/components/ui/Logo"
import { verifySession } from '@/src/auth/dal'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {

    const { user } = await verifySession();

    return (
        <>
            <header>
                <div className="flex items-center justify-between p-4 bg-gray-50 text-gray-850">
                    <Logo />
                    <nav className="flex space-x-4">
                        <a href="/admin" className="hover:text-gray-300">Dashboard</a>
                        <a href="/admin/products" className="hover:text-gray-300">Products</a>
                        <a href="/admin/orders" className="hover:text-gray-300">Orders</a>
                        <a href="/admin/users" className="hover:text-gray-300">Users</a>
                    </nav>
                    <AdminMenu user={user} />
                </div>
            </header>

            <div>
                {children}
            </div>
        </>

    )
}