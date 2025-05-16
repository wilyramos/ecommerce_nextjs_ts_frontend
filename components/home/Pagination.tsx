import Link from "next/link"

type PaginationProps = {
    
    currentPage: number;
    totalPages: number;
    limit: number;
    category?: string;
    priceRange?: string;
}

export default function Pagination({ currentPage, totalPages, limit, category, priceRange }: PaginationProps) {

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-end mt-8">
            <nav className="inline-flex items-center space-x-2">
                {currentPage > 1 && (
                    <Link
                        href={{
                            pathname: "/productos",
                            query: {
                                page: currentPage - 1,
                                limit,
                                category: category || undefined,
                                priceRange: priceRange || undefined,
                            },
                        }}
                        className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                        &lt;
                    </Link>
                )}

                {pages.map((page) => (
                    <Link
                        key={page}
                        href={{
                            pathname: "/productos",
                            query: {
                                page,
                                limit,
                                category: category || undefined,
                                priceRange: priceRange || undefined,
                            },
                        }}
                        className={`px-3 py-2 text-sm border rounded-lg ${currentPage === page
                                ? "bg-blue-600 text-white"
                                : "text-gray-600 border-gray-300 hover:bg-gray-100 transition"
                            }`}
                    >
                        {page}
                    </Link>
                ))}

                {currentPage < totalPages && (
                    <Link
                        href={{
                            pathname: "/productos",
                            query: {
                                page: currentPage + 1,
                                limit,
                                category: category || undefined,
                                priceRange: priceRange || undefined,
                            },
                        }}
                        className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                        &gt;
                    </Link>
                )}
            </nav>
        </div>
    );
}