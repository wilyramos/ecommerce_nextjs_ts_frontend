"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    limit?: number;
    pathname: string;
};

export default function Pagination({
    currentPage,
    totalPages,
    limit = 10,
    pathname,
}: PaginationProps) {
    const searchParams = useSearchParams();

    const getPageLink = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        params.set("limit", limit.toString());
        return `${pathname}?${params.toString()}`;
    };

    const createPages = () => {
        const pages = [];
        const sidePages = 1;

        if (currentPage > sidePages + 2) {
            pages.push(1, "...");
        } else {
            for (let i = 1; i <= Math.min(sidePages + 2, totalPages); i++) {
                pages.push(i);
            }
        }

        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            if (!pages.includes(i)) {
                pages.push(i);
            }
        }

        if (currentPage < totalPages - (sidePages + 1)) {
            pages.push("...", totalPages);
        } else {
            for (
                let i = Math.max(totalPages - (sidePages + 1), 2);
                i <= totalPages;
                i++
            ) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }
        }

        return pages;
    };

    const pages = createPages();

    return (
        <div className="flex justify-center items-center mt-2">
            <nav className="inline-flex items-center space-x-2 p-2">
                {pages.map((page, index) =>
                    typeof page === "number" ? (
                        <Link
                            key={page}
                            href={getPageLink(page)}
                            className={`flex items-center justify-center w-9 h-9 text-sm font-medium rounded-full transition-colors ${page === currentPage
                                    ? "bg-black text-white shadow"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-800"
                                }`}
                        >
                            {page}
                        </Link>
                    ) : (
                        <span
                            key={`ellipsis-${index}`}
                            className="flex items-center justify-center w-9 h-9 text-sm text-gray-400"
                        >
                            ...
                        </span>
                    )
                )}
            </nav>
        </div>
    );
}
