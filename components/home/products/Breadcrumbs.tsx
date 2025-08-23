// File: frontend/components/home/products/Breadcrumb.tsx

import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

type Props = {
    categoryName: string;
    categorySlug: string;
    productName: string;
};

export default function Breadcrumb({ categoryName, categorySlug, productName }: Props) {
    return (
        <nav className="text-xs py-1">
           
            {/* 🧭 Rastro de navegación */}
            <ol className="flex items-center flex-wrap gap-1 text-gray-600">
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
