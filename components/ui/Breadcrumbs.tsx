"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuChevronRight } from "react-icons/lu";

type BreadcrumbsProps = {
    current?: string;
};

export default function Breadcrumbs({ current }: BreadcrumbsProps) {
    const pathname = usePathname();

    const segments = pathname
        .split("/")
        .filter(Boolean)
        .map((segment, index, arr) => {
            const href = "/" + arr.slice(0, index + 1).join("/");

            return {
                label: segment.charAt(0).toUpperCase() + segment.slice(1),
                href,
            };
        });

    return (
        <nav className="text-sm text-[var(--store-text-muted)] max-w-full">
            <ol className="flex items-center gap-1 overflow-hidden min-w-0">
                <li className="shrink-0">
                    <Link href="/" className="hover:underline whitespace-nowrap">
                        Inicio
                    </Link>
                </li>

                {segments.map((segment, index) => (
                    <li
                        key={segment.href}
                        className="flex items-center gap-1 min-w-0 overflow-hidden"
                    >
                        <LuChevronRight size={14} className="shrink-0" />

                        {index === segments.length - 1 ? (
                            <span
                                className="
                  font-medium truncate
                  min-w-0 max-w-full
                  text-[var(--store-text)]
                  pointer-events-none
                "
                                title={current || segment.label}
                            >
                                {current || segment.label}
                            </span>
                        ) : (
                            <Link
                                href={segment.href}
                                className="hover:underline truncate min-w-0"
                                title={segment.label}
                            >
                                {segment.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
