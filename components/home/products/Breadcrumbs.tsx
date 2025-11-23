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
        <nav className="text-xs px-4 md:py-1">
            <ol className="flex items-center flex-wrap gap-1 text-gray-600">

                <li>
                    <Link
                        href="/"
                        className="hover:text-gray-800 transition-colors text-gray-600"
                    >
                        Inicio
                    </Link>
                </li>

                <LuChevronRight size={14} className="text-gray-500" />

                <li>
                    <Link
                        href={`/categoria/${categorySlug}`}
                        className="hover:text-gray-800 transition-colors text-gray-600"
                    >
                        {categoryName}
                    </Link>
                </li>

                <LuChevronRight size={14} className="text-gray-500" />

                <li className="text-gray-800 font-semibold truncate max-w-[150px] md:max-w-[300px]">
                    {productName}
                </li>

            </ol>
        </nav>

    );
}
