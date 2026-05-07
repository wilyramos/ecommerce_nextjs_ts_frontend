// components/admin/AdminPageWrapper.tsx
import React from "react";
import BackButton from "@/components/ui/BackButton";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

type BreadcrumbItem = {
    label: string;
    href: string;
};

type AdminPageWrapperProps = {
    title: string;
    children: React.ReactNode;
    breadcrumbItems?: BreadcrumbItem[];  // items intermedios (sin Home, sin current)
    breadcrumbCurrent?: string;          // página actual (no linkeable)
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
        <div className="flex flex-col min-h-screen bg-[var(--color-bg-primary)]">
            {/* ── HEADER ── */}
            <header className="shrink-0 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] px-6 py-6 md:px-8">
                <div className="max-w-[1400px] mx-auto space-y-4">

                    {/* Breadcrumb */}
                    {hasBreadcrumb && (
                        <Breadcrumbs
                            items={breadcrumbItems}
                            current={breadcrumbCurrent}
                        />
                    )}

                    {/* Title & Actions */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
                            {title}
                        </h1>

                        <div className="flex items-center gap-3">
                            {actions && (
                                <div className="flex items-center gap-2">{actions}</div>
                            )}
                            {actions && showBackButton && (
                                <div className="h-6 w-px bg-[var(--color-border-default)] mx-1 hidden md:block" />
                            )}
                            {showBackButton && <BackButton />}
                        </div>
                    </div>
                </div>
            </header>

            {/* ── CONTENT ── */}
            <main className="flex-1 px-6 py-8 md:px-8">
                <div className="max-w-[1400px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}