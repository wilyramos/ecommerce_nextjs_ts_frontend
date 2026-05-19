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
        <div className="flex flex-col min-h-screen bg-background text-foreground select-none">
            {/* ── HEADER ── */}
            <header className="shrink-0 border-b border-border bg-background px-4 py-4 md:px-6">
                <div className="max-w-screen-2xl mx-auto space-y-3">

                    {/* Breadcrumb */}
                    {hasBreadcrumb && (
                        <div className="text-[11px] font-medium">
                            <Breadcrumbs
                                items={breadcrumbItems}
                                current={breadcrumbCurrent}
                            />
                        </div>
                    )}

                    {/* Title & Actions */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <H1 className="text-xl md:text-2xl tracking-tight border-none pb-0">
                            {title}
                        </H1>

                        <div className="flex items-center gap-2.5 self-end sm:self-auto">
                            {actions && (
                                <div className="flex items-center gap-2">{actions}</div>
                            )}
                            {actions && showBackButton && (
                                <div className="h-4 w-px bg-border mx-0.5 hidden sm:block" />
                            )}
                            {showBackButton && <BackButton />}
                        </div>
                    </div>
                </div>
            </header>

            {/* ── CONTENT ── */}
            <main className="flex-1 px-4 py-6 md:px-6">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}