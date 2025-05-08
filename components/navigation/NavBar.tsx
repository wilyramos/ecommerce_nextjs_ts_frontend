import Image from 'next/image'
import Link from 'next/link'
import { FaUser } from 'react-icons/fa'

export default function NavBar() {
    return (
        <nav className='bg-gray-50 px-40 py-4 shadow-md'>
            <div className='container mx-auto flex justify-between items-center'>
                <Link href='/' className='text-gray-500 text-2xl font-bold '>
                    <Image
                        src={'/logo.svg'}
                        alt='Logo'
                        width={50}
                        height={50}
                    />
                </Link>

                <div className='flex items-center gap-4'>

                    <Link href='/auth/registro' className='text-gray-500 text-lg font-semibold hover:text-gray-900 transition'>
                        <FaUser />
                    </Link>

                    <Link href='/shop' className='text-gray-500 text-lg font-semibold hover:text-gray-900 transition'>
                        Tienda
                    </Link>
                    <Link href='/cart' className='text-gray-500 text-lg font-semibold hover:text-gray-900 transition'>
                        Carrito
                    </Link>
                </div>

            </div>

        </nav>
    )
}
