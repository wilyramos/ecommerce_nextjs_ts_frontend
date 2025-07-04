import Image from 'next/image';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';
import ButtonShowCart from '../ui/ButtonShowCart';
import Logo from '../ui/Logo';
import ButtonSearchFormStore from '../ui/ButtonSearchFormStore';
import ButtonShowSheetMobile from './ButtonShowSheetMobile';

export default function NavBar() {

    const categoriaswithsubcategorias = [
        {
            name: 'Celulares', subcategorias: [
                { slug: 'iphone', name: 'iPhone' },
                { slug: 'samsung', name: 'Samsung' },
                { slug: 'xiaomi', name: 'Xiaomi' },

                { slug: 'oppo', name: 'Oppo' },
            ]
        },
        {
            name: 'Accesorios', slug: 'accesorios', subcategorias: [
                { slug: 'cargadores-y-cables', name: 'Cargadores y Cables' },
                { slug: 'fundas-y-carcasas', name: 'Fundas y Carcasas' },
                // { slug: 'protectores-de-pantalla', name: 'Protectores de Pantalla' },
                { slug: 'audifonos-y-auriculares', name: 'Audífonos y Auriculares' },
                // { slug: 'otros-accesorios', name: 'Otros Accesorios' },
            ]
        },
        // { name: 'Audífonos', subcategorias: [], slug: 'auriculares-y-audifonos' },
        // { name: 'Cargadores', subcategorias: [] },
    ];


    return (
        <header className="sticky top-0 z-50 bg-white text-gray-950">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 font-semibold text-sm md:text-base pt-4 pb-2">
                {/* Mobile: Menú y buscador */}
                <div className="md:hidden flex items-center gap-2">
                    <ButtonShowSheetMobile />
                </div>

                {/* Mobile: Logo centrado (sin capturar eventos) */}
                <div className="md:hidden absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none z-[-1]">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logob.svg"
                            alt="Logo"
                            width={50}
                            height={50}
                            priority
                            className="w-auto h-10"
                        />
                    </Link>
                </div>

                {/* Desktop: Logo a la izquierda */}
                <Link href="/" className="hidden md:flex items-center">
                    <Logo />
                </Link>

                {/* Desktop: Navegación + Buscador */}
                <nav className="hidden md:flex items-center justify-center flex-1 space text-sm font-normal text-gray-700">
                    {categoriaswithsubcategorias.map((categoria) => (
                        <div key={categoria.name} className="relative">
                            <div className="group inline-block px-2 py-1">
                                <button
                                    // href={`categoria/${categoria.slug || categoria.name.toLowerCase()}`}
                                    className="hover:text-black transition-colors"
                                >
                                    {categoria.name}
                                </button>

                                {categoria.subcategorias.length > 0 && (
                                    <div
                                        className="absolute top-full left-0 mt-0 min-w-[12rem] bg-white border border-gray-200 rounded-md shadow-lg opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 ease-out z-50"
                                    >
                                        {categoria.subcategorias.map((sub) => (
                                            <Link
                                                key={sub.slug}
                                                href={`/categoria/${sub.slug}`}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:text-black hover:bg-gray-50 transition-colors"
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}



                    {/* Buscador visible solo en escritorio */}
                    <div className="w-full max-w-sm ml-6">
                        <ButtonSearchFormStore />
                    </div>
                </nav>

                {/* Desktop: Iconos a la derecha */}
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        href="/auth/registro"
                        className="block hover:text-indigo-800 transition"
                        aria-label="Registro / Usuario"
                    >
                        <FaUser size={20} />
                    </Link>
                    <ButtonShowCart />
                </div>

                {/* Mobile: Iconos a la derecha */}
                <div className="md:hidden">
                    {/* <div className="absolute top-0 right-0 h-full px-6 flex items-center gap-4 mt-1"> */}
                    {/* <Link href="/auth/registro" className="hover:text-indigo-800 transition">
                            <FaUser size={20} />
                        </Link> */}
                    <ButtonShowCart />
                    {/* </div> */}
                </div>
            </div>
        </header>
    );
}