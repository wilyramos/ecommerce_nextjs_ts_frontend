// components/home/sections/SectionHeader.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
    title: React.ReactNode;
    subtitle?: string;
    viewAllHref?: string;
    viewAllLabel?: string;
}

export default function SectionHeader({
    title,
    subtitle,
    viewAllHref,
    viewAllLabel = "Ver todo",
}: SectionHeaderProps) {
    const formatTitle = (node: React.ReactNode): React.ReactNode => {
        if (typeof node !== "string") return node;

        const words = node.trim().split(/\s+/);
        if (words.length < 2) return node;

        return (
            <>
                {words[0]}{" "}
                <span className="text-action-cta font-light italic">
                    {words[1]}
                </span>
                {words.length > 2 && " " + words.slice(2).join(" ")}
            </>
        );
    };

    return (
        <div className="w-full flex items-end justify-between mb-5 select-none border-b border-border pb-3">
            <div className="flex flex-col gap-0.5">
                {subtitle && (
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {subtitle}
                    </span>
                )}
                <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
                    {formatTitle(title)}
                </h2>
            </div>

            {viewAllHref && (
                <Link
                    href={viewAllHref}
                    className="flex items-center gap-1 text-xs md:text-sm text-foreground hover:text-action-cta font-medium transition-colors duration-200 shrink-0 mb-0.5"
                >
                    {viewAllLabel}
                    <ChevronRight size={14} strokeWidth={2.5} />
                </Link>
            )}
        </div>
    );
}