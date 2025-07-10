// File: frontend/components/home/products/Breadcrumb.tsx

import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { LuChevronRight } from "react-icons/lu";

type Props = {
    categoryName: string;
    categorySlug: string;
    productName: string;
};

export default function Breadcrumb({ categoryName, categorySlug, productName }: Props) {
    return (
        <nav className="text-xs font-bold text-gray-500">
            <div>
                <Link
                    href={`/categoria/${categorySlug}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                    <IoArrowBack size={16} />
                </Link>
            </div>

            {/* 🧭 Rastro de navegación */}
            <ol className="flex items-center flex-wrap gap-1 text-gray-400">
                <li>
                    <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
                </li>

                <LuChevronRight size={14} />

                <li>
                    <Link
                        href={`/categoria/${categorySlug}`}
                        className="hover:text-blue-600 transition-colors"
                    >
                        {categoryName}
                    </Link>
                </li>

                <LuChevronRight size={14} />

                <li className="text-gray-700 font-semibold truncate max-w-[250px]">
                    {productName}
                </li>
            </ol>
        </nav>
    );
}
