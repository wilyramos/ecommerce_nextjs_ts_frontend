// File: frontend/components/home/products/Breadcrumb.tsx
import Link from "next/link";
import { LuChevronRight, LuHouse } from "react-icons/lu";
import { BiCategory } from "react-icons/bi";


type Props = {
    categoryName: string;
    categorySlug: string;
    productName: string;
};

export default function Breadcrumb({ categoryName, categorySlug, productName }: Props) {
    return (
        <nav className="text-xs px-4 md:py-1">
            <ol className="flex items-center flex-wrap gap-2 text-xs md:text-sm text-slate-500 font-medium">
                {/* Inicio */}
                <li>
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 hover:text-blue-800 transition-colors duration-200"
                    >
                        <LuHouse size={15} className="mb-[1px]" />
                        <span>Inicio</span>
                    </Link>
                </li>

                <LuChevronRight size={14} className="text-slate-400" />

                {/* Categoría */}
                <li>
                    <Link
                        href={`/categoria/${categorySlug}`}
                        className="flex items-center gap-1.5 hover:text-blue-800 transition-colors duration-200"
                    >
                        <BiCategory size={15} className="mb-[1px]" />
                        <span>{categoryName}</span>
                    </Link>
                </li>

                <LuChevronRight size={14} className="text-slate-400" />

                {/* Producto */}
                <li className="flex items-center gap-1.5 text-slate-900 truncate max-w-[150px] md:max-w-md pointer-events-none">
                    <span className="truncate font-semibold">{productName}</span>
                </li>
            </ol>
        </nav>
    );
}
