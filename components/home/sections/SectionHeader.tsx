// File: frontend/components/home/sections/SectionHeader.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { H2, Small } from "@/components/ui/TypographyV3";

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
        <span className="font-light text-text-secondary">
          {words[1]}
        </span>
        {words.length > 2 && " " + words.slice(2).join(" ")}
      </>
    );
  };

  return (
    <div className="mb-6 flex w-full select-none items-end justify-between pb-3">
      <div className="flex flex-col gap-0.5">
        {subtitle && (
          <Small className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-tertiary">
            {subtitle}
          </Small>
        )}
        <H2 className="text-xl sm:text-2xl">
          {formatTitle(title)}
        </H2>
      </div>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="group mb-0.5 inline-flex shrink-0 items-center gap-1 text-xs font-medium text-brand-accent transition-colors duration-fast hover:underline focus-visible:outline-none"
        >
          <span>{viewAllLabel}</span>
          <ChevronRight size={14} strokeWidth={2} className="transition-transform duration-fast group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}