import Image from 'next/image';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';
import ButtonShowCart from '../ui/ButtonShowCart';
import MobileMenuToggle from '../ui/MobileMenuToggle';
import Logo from '../ui/Logo';
import ButtonSearchFormStore from '../ui/ButtonSearchFormStore';

export default function NavBar() {

    const categoriaswithsubcategorias = [
        {
            name: 'iPhones', subcategorias: [
                { slug: 'iphones-14', name: 'iPhone 14' },
                { slug: 'iphones-15', name: 'iPhone 15' },
                { slug: 'iphones-16', name: 'iPhone 16' },
            ]
        },
        {
            name: 'Accesorios', subcategorias: [
                { slug: 'cargadores', name: 'Cargadores' },
                { slug: 'fundas', name: 'Fundas' },
            ]
        },
        { name: 'Audífonos', subcategorias: [] },
        { name: 'Cargadores', subcategorias: [] },
        { name: 'Fundas', subcategorias: [] },
    ];


    return (
        <header className="sticky top-0 z-50 bg-white text-gray-800">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 font-semibold text-sm md:text-base py-1">
                {/* Mobile: Menú y buscador */}
                <div className="md:hidden flex items-center gap-2">
                    <MobileMenuToggle />
                </div>

                {/* Mobile: Logo centrado (sin capturar eventos) */}
                <div className="md:hidden absolute top-0 left-0 w-full h-full flex justify-center items-center z-0 pointer-events-auto">
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
                        <div
                            key={categoria.name}
                            className="relative group transition-colors"
                        >
                            <Link
                                href={`/${categoria.name}`}
                                className="px-2 py-1 hover:text-black transition-colors"
                            >
                                {categoria.name}
                            </Link>

                            {categoria.subcategorias.length > 0 && (
                                <div
                                    className="absolute top-full left-0 mt-3 min-w-[12rem] bg-white border-gray-200 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out z-50"
                                >
                                    {categoria.subcategorias.map((sub) => (
                                        <Link
                                            key={sub.name}
                                            href={`/categoria/${sub.slug}`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:text-black hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            {sub.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
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
                        className="block hover:text-indigo-800 transition duration-300"
                        aria-label="Registro / Usuario"
                    >
                        <FaUser size={20} />
                    </Link>
                    <ButtonShowCart />
                </div>

                {/* Mobile: Iconos a la derecha */}
                <div className="md:hidden">
                    <div className="absolute top-0 right-0 h-full px-6 flex items-center gap-4 mt-1">
                        {/* <Link href="/auth/registro" className="hover:text-indigo-800 transition">
                            <FaUser size={20} />
                        </Link> */}
                        <ButtonShowCart />
                    </div>
                </div>
            </div>
        </header>
    );
}
