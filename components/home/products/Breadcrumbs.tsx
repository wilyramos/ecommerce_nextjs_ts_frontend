// File: frontend/components/home/products/Breadcrumb.tsx
import Link from "next/link";
import { LuChevronRight, LuHouse } from "react-icons/lu";
import { BiCategory } from "react-icons/bi";

type Props = {
    categoryName: string;
    categorySlug: string;
    productName: string;
};

export default function Breadcrumb({
    categoryName,
    categorySlug,
    productName,
}: Props) {
    return (
        <nav
            className="
        px-4
        text-xs md:text-sm
        bg-[var(--store-bg)]
      "
            aria-label="Breadcrumb"
        >
            <ol
                className="
          flex flex-wrap items-center gap-2
          font-medium
          text-[var(--store-text-muted)]
        "
            >
                {/* Inicio */}
                <li>
                    <Link
                        href="/"
                        className="
              flex items-center gap-1.5
              transition-colors duration-200
              hover:text-[var(--store-text)]
            "
                    >
                        <LuHouse size={15} className="mb-[1px]" />
                        <span>Inicio</span>
                    </Link>
                </li>

                <LuChevronRight
                    size={14}
                    className="text-[var(--store-text-muted)] opacity-70"
                />

                {/* Categoría */}
                <li>
                    <Link
                        href={`/categoria/${categorySlug}`}
                        className="
              flex items-center gap-1.5
              transition-colors duration-200
              hover:text-[var(--store-text)]
            "
                    >
                        <BiCategory size={15} className="mb-[1px]" />
                        <span>{categoryName}</span>
                    </Link>
                </li>

                <LuChevronRight
                    size={14}
                    className="text-[var(--store-text-muted)] opacity-70"
                />

                {/* Producto actual */}
                <li
                    className="
            flex items-center gap-1
            truncate
            max-w-[140px] md:max-w-lg
            text-[var(--store-text)]
            pointer-events-none
          "
                >
                    <span className="truncate font-semibold">
                        {productName}
                    </span>
                </li>
            </ol>
        </nav>
    );
}
