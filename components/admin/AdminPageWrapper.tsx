//File: frontend/components/admin/AdminPageWrapper.tsx

import React from "react";
import BackButton from "@/components/ui/BackButton";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { H1 } from "../ui/Typography";

type BreadcrumbItem = {
    label: string;
    href: string;
};

type AdminPageWrapperProps = {
    title: string;
    children: React.ReactNode;
    breadcrumbItems?: BreadcrumbItem[];
    breadcrumbCurrent?: string;
    showBackButton?: boolean;
    actions?: React.ReactNode;
};

export default function AdminPageWrapper({
    title,
    children,
    breadcrumbItems = [],
    breadcrumbCurrent,
    showBackButton = true,
    actions,
}: AdminPageWrapperProps) {
    const hasBreadcrumb = breadcrumbItems.length > 0 || breadcrumbCurrent;

    return (
        <div className="flex flex-col min-h-screen bg-background-secondary text-foreground select-none">
            {/* ── HEADER ── */}
            <header className="shrink-0 border-b border-border bg-background px-4 py-5 md:px-8 relative overflow-hidden">
                <div className="max-w-screen-2xl mx-auto space-y-4">
                    {/* Breadcrumb */}
                    {hasBreadcrumb && (
                        <div className="text-[11px] font-medium tracking-wide opacity-90">
                            <Breadcrumbs
                                items={breadcrumbItems}
                                current={breadcrumbCurrent}
                            />
                        </div>
                    )}

                    {/* Title & Actions */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <H1 className="">
                            {title}
                        </H1>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                            {actions && (
                                <div className="flex items-center gap-2">{actions}</div>
                            )}
                            {actions && showBackButton && (
                                <div className="h-5 w-px bg-border mx-1 hidden sm:block" />
                            )}
                            {showBackButton && (
                                <div className="transition-transform duration-200 active:scale-95">
                                    <BackButton />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* ── CONTENT ── */}
            <main className="flex-1 px-4 py-8 md:px-8">
                <div className="max-w-screen-2xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}