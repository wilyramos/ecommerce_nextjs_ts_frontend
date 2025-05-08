import { User } from '@/src/schemas'
import Image from 'next/image'
import Link from 'next/link'
import AdminMenu from "@/components/admin/AdminMenu";



export default function AdminSidebar({ user }: { user: User }) {
    return (

        <>
            <div className="flex flex-col w-64 h-screen bg-gray-50 border-r border-gray-200">
                <div className="flex items-center justify-center h-16 bg-gray-200 text-white">
                    <Image
                        src={'/logo.svg'}
                        alt='Logo'
                        width={50}
                        height={50}
                    />
                </div>
                <nav className="flex flex-col p-4 space-y-2">
                    <Link href="/admin" className="hover:text-gray-300">Home</Link>
                    <Link href="/admin/products" className="hover:text-gray-300">Products</Link>
                    <Link href="/admin/orders" className="hover:text-gray-300">Orders</Link>
                    <Link href="/admin/users" className="hover:text-gray-300">Users</Link>                        
                    
                </nav>

                <div className="flex-grow"></div>
                <div className="flex items-center justify-between h-16 bg-gray-800 text-white px-2">
                    <p className='text-center'>Hola <span className='font-extrabold text-gray-700'>{user.nombre}</span> </p>
                    
                    <AdminMenu user={user} />
                </div>
            </div>


        </>

    )
}
