// Pagination.tsx
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

    if (totalPages <= 1) return null; // Ocultar paginación si solo hay 1 página

    return (
        <div className="flex justify-end mt-8">
            <nav className="inline-flex items-center space-x-2">
                {currentPage > 1 && (
                    <Link
                        href={{ pathname, query: getQuery(currentPage - 1) }}
                        className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                        &lt;
                    </Link>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Link
                        key={page}
                        href={{ pathname, query: getQuery(page) }}
                        className={`px-3 py-2 text-sm border rounded-lg ${currentPage === page
                            ? "bg-black text-white"
                            : "text-gray-600 border-gray-300 hover:bg-gray-100 transition"
                            }`}
                    >
                        {page}
                    </Link>
                ))}

                {currentPage < totalPages && (
                    <Link
                        href={{ pathname, query: getQuery(currentPage + 1) }}
                        className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                        &gt;
                    </Link>
                )}
            </nav>
        </div>
    );
}
