// components/ui/Pagination.tsx
import Link from "next/link";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    limit?: number;
    pathname: string; // Ruta base, ej. /admin/products
};

export default function Pagination({ currentPage, totalPages, limit = 5, pathname }: PaginationProps) {
    

    const visitablePages = () => {
        const pages = [];
        const maxPagesToShow = 5; // Número máximo de páginas a mostrar

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
            const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
        }

        return pages;
    }

    const getPageLink = (page: number) =>
        `${pathname}?page=${page}${limit ? `&limit=${limit}` : ""}`;

    const pages = visitablePages();

    return (
        <div className="flex justify-center mt-8">
            <nav className="inline-flex items-center space-x-1">
                {currentPage > 1 && (
                    <Link
                        href={getPageLink(currentPage - 1)}
                        className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg transition"
                    >
                        &lt;
                    </Link>
                )}

                {pages.map((page) => (
                    <Link
                        key={page}
                        href={getPageLink(page)}
                        className={`px-3 py-2 text-sm border border-gray-300 rounded-lg transition ${
                            page === currentPage
                                ? "bg-blue-600 text-white"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {page}
                    </Link>
                ))}

                {currentPage < totalPages && (
                    <Link   
                        href={getPageLink(currentPage + 1)}
                        className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg transition"
                    >
                        &gt;
                    </Link>
                )}
            </nav>
        </div>
    );
}
