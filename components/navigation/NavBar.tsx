import Image from 'next/image'
import Link from 'next/link'
import { FaUser } from 'react-icons/fa'

export default function NavBar() {
    return (
        <nav className='bg-gray-800 p-4'>
            <div className='container mx-auto flex justify-between items-center'>
                <Link href='/' className='text-white text-2xl font-bold'>
                    <Image
                        src={'/vercel.svg'}
                        alt='Logo'
                        width={50}
                        height={50}
                    />                
                </Link>
                
                <Link href='/auth/registro' className='text-white text-lg font-semibold'>
                    <FaUser />
                </Link>
                
                <Link href='/shop' className='text-white text-lg font-semibold'>
                    Tienda
                </Link>
                <Link href='/cart' className='text-white text-lg font-semibold'>
                    Carrito
                </Link>

            </div>

        </nav>
  )
}
