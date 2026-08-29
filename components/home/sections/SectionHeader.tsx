// File: components/home/sections/SectionHeader.tsx

"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { H2, Small } from "@/components/ui/TypographyStore";

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
                <span className="font-light italic text-muted-foreground">
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
                    <Small className="uppercase tracking-wider font-medium">
                        {subtitle}
                    </Small>
                )}
                <H2 className="sm:text-xl">
                    {formatTitle(title)}
                </H2>
            </div>

            {viewAllHref && (
                <Link
                    href={viewAllHref}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors shrink-0 mb-0.5"
                >
                    <Small className="font-medium text-foreground hover:text-inherit">
                        {viewAllLabel}
                    </Small>
                    <ChevronRight size={13} strokeWidth={2} />
                </Link>
            )}
        </div>
    );
}