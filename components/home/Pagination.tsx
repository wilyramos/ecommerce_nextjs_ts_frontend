// Pagination.tsx — diseño moderno + responsive (solo UI)

import Link from "next/link";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    limit: number;
    pathname: string;
    queryParams?: Record<string, string | number | undefined>;
};

export default function Pagination({
    currentPage,
    totalPages,
    limit,
    pathname,
    queryParams = {},
}: PaginationProps) {
    const getQuery = (page: number) => ({ ...queryParams, page, limit });

    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-center md:justify-end mt-8">
            <nav className="flex items-center gap-1 rounded-full bg-white/70 backdrop-blur
                      px-2 py-1 shadow-sm border border-gray-200">

                {/* Prev */}
                {currentPage > 1 && (
                    <Link
                        href={{ pathname, query: getQuery(currentPage - 1) }}
                        className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center
                       rounded-full text-gray-500 hover:bg-gray-100
                       hover:text-black transition"
                    >
                        ‹
                    </Link>
                )}

                {/* Pages */}
                {pages.map((page) => {
                    const isActive = currentPage === page;

                    return (
                        <Link
                            key={page}
                            href={{ pathname, query: getQuery(page) }}
                            className={`flex items-center justify-center rounded-full font-medium transition
                h-8 w-8 text-xs md:h-9 md:w-9 md:text-sm
                ${isActive
                                    ? "bg-black text-white shadow"
                                    : "text-gray-500 hover:bg-gray-100 hover:text-black"
                                }`}
                        >
                            {page}
                        </Link>
                    );
                })}

                {/* Next */}
                {currentPage < totalPages && (
                    <Link
                        href={{ pathname, query: getQuery(currentPage + 1) }}
                        className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center
                       rounded-full text-gray-500 hover:bg-gray-100
                       hover:text-black transition"
                    >
                        ›
                    </Link>
                )}
            </nav>
        </div>
    );
}
