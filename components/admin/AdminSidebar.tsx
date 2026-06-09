"use client";

import { User } from "@/src/schemas";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import AdminMenu from "./AdminMenu";
import Logo from "../ui/Logo";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
    Smartphone,
    Receipt,
    Images,
    Layers,
    Bookmark,
    GitFork,
    Folder,
    Library,
    BarChart,
    ShieldCheck,
    MonitorSmartphone,
    ChevronRight,
    ChevronDown,
    Menu,
} from "lucide-react";

type NavLink = {
    href?: string;
    icon: React.ElementType;
    label: string;
    children?: { href: string; label: string }[];
    external?: boolean;
};

const links: NavLink[] = [
    { href: "/admin/products", icon: Smartphone, label: "Productos" },
    { href: "/admin/orders", icon: Receipt, label: "Órdenes" },
    { href: "/admin/orders-v2", icon: Folder, label: "Órdenes nuevas" },
    { href: "/admin/slider", icon: Images, label: "Slider" },
    { href: "/admin/advertisements", icon: Images, label: "Avisos" },
    { href: "/admin/sections", icon: Folder, label: "Secciones" },
    { href: "/admin/comparisons", icon: Layers, label: "Comparativas" },
    { href: "/admin/claims", icon: Layers, label: "Reclamos" },
    { href: "/admin/media", icon: Images, label: "Medios" },
    { href: "/admin/collections", icon: Library, label: "Colecciones" },
    { href: "/admin/brands", icon: Bookmark, label: "Marcas" },
    { href: "/admin/lines", icon: GitFork, label: "Líneas" },
    { href: "/admin/products/category", icon: Folder, label: "Categorías" },
    { href: "/admin/reports", icon: BarChart, label: "Reportes" },
    {
        icon: ShieldCheck,
        label: "Usuarios",
        children: [{ href: "/admin/users", label: "Lista de usuarios" }],
    },
    {

        href: "/pos",
        icon: MonitorSmartphone,
        label: "Punto de Venta",
        external: true,
    },
];

// ─── Shared nav item (desktop) ────────────────────────────────────────────────

function NavItem({
    item,
    expanded,
    openMenus,
    onToggle,
    pathname,
}: {
    item: NavLink;
    expanded: boolean;
    openMenus: Record<string, boolean>;
    onToggle: (label: string) => void;
    pathname: string;
}) {
    const { href, icon: Icon, label, children, external } = item;

    if (children) {
        const isOpen = openMenus[label];
        const isChildActive = children.some((c) => c.href === pathname);

        return (
            <div className="space-y-0.5">
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <button
                            onClick={() => onToggle(label)}
                            className={cn(
                                "group flex w-full items-center justify-between rounded-md px-3 py-2 text-[13px] font-medium transition-colors outline-none",
                                isChildActive
                                    ? "bg-muted text-foreground"
                                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className="h-4 w-4 shrink-0" />
                                <span
                                    className={cn(
                                        "transition-opacity duration-200",
                                        expanded ? "opacity-100" : "opacity-0 hidden"
                                    )}
                                >
                                    {label}
                                </span>
                            </div>
                            {expanded && (
                                <ChevronDown
                                    className={cn(
                                        "h-3.5 w-3.5 text-muted-foreground/60 transition-transform duration-200",
                                        isOpen && "rotate-180"
                                    )}
                                />
                            )}
                        </button>
                    </TooltipTrigger>
                    {!expanded && (
                        <TooltipContent side="right" className="text-xs font-medium">
                            {label}
                        </TooltipContent>
                    )}
                </Tooltip>

                <div
                    className={cn(
                        "grid overflow-hidden transition-all duration-200 ease-in-out",
                        isOpen && expanded
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                    )}
                >
                    <div className="min-h-0 pl-7 pr-1">
                        <div className="border-l border-border pl-2.5 space-y-0.5 py-1">
                            {children.map((sub) => {
                                const isActive = pathname === sub.href;
                                return (
                                    <Link
                                        key={sub.href}
                                        href={sub.href}
                                        className={cn(
                                            "block rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors outline-none",
                                            isActive
                                                ? "text-primary font-semibold"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {sub.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const isActive =
        href && (pathname === href || pathname.startsWith(`${href}/`));

    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
                <Link
                    href={href!}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className={cn(
                        "group flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors outline-none",
                        isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span
                        className={cn(
                            "transition-opacity duration-200",
                            expanded ? "opacity-100" : "opacity-0 hidden"
                        )}
                    >
                        {label}
                    </span>
                </Link>
            </TooltipTrigger>
            {!expanded && (
                <TooltipContent side="right" className="text-xs font-medium">
                    {label}
                </TooltipContent>
            )}
        </Tooltip>
    );
}

// ─── Mobile nav item (inside Sheet) ──────────────────────────────────────────

function MobileNavItem({
    item,
    pathname,
    openMenus,
    onToggle,
    onClose,
}: {
    item: NavLink;
    pathname: string;
    openMenus: Record<string, boolean>;
    onToggle: (label: string) => void;
    onClose: () => void;
}) {
    const { href, icon: Icon, label, children, external } = item;

    if (children) {
        const isOpen = openMenus[label];
        const isChildActive = children.some((c) => c.href === pathname);

        return (
            <div>
                <button
                    onClick={() => onToggle(label)}
                    className={cn(
                        "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                        isChildActive
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left">{label}</span>
                    {isOpen ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground/60" />
                    ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
                    )}
                </button>

                {isOpen && (
                    <div className="ml-7 mt-0.5 border-l border-border pl-2.5 space-y-0.5 py-1">
                        {children.map((sub) => {
                            const isActive = pathname === sub.href;
                            return (
                                <Link
                                    key={sub.href}
                                    href={sub.href}
                                    onClick={onClose}
                                    className={cn(
                                        "block rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                                        isActive
                                            ? "text-primary font-semibold"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {sub.label}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    const isActive =
        href && (pathname === href || pathname.startsWith(`${href}/`));

    return (
        <Link
            href={href!}
            onClick={onClose}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
        >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{label}</span>
        </Link>
    );
}

// ─── NavList shared ───────────────────────────────────────────────────────────

function NavList({
    expanded,
    openMenus,
    onToggle,
    onClose,
    isMobile = false,
}: {
    expanded: boolean;
    openMenus: Record<string, boolean>;
    onToggle: (label: string) => void;
    onClose?: () => void;
    isMobile?: boolean;
}) {
    const pathname = usePathname();

    return (
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 scrollbar-none">
            {links.map((item, i) => (
                <div key={`${item.label}-${i}`}>

                    {isMobile ? (
                        <MobileNavItem
                            item={item}
                            pathname={pathname}
                            openMenus={openMenus}
                            onToggle={onToggle}
                            onClose={onClose ?? (() => { })}
                        />
                    ) : (
                        <NavItem
                            item={item}
                            expanded={expanded}
                            openMenus={openMenus}
                            onToggle={onToggle}
                            pathname={pathname}
                        />
                    )}
                </div>
            ))}
        </nav>
    );
}

// ─── UserFooter ───────────────────────────────────────────────────────────────

function UserFooter({ user, expanded }: { user: User; expanded: boolean }) {
    return (
        <div className="border-t border-border p-2">
            <div
                className={cn(
                    "flex items-center gap-2.5 rounded-md p-2 hover:bg-muted/60 transition-colors",
                    expanded ? "justify-between" : "justify-center"
                )}
            >
                <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0 border border-border">
                        {user?.nombre?.charAt(0).toUpperCase()}
                    </div>
                    {expanded && (
                        <div className="flex flex-col truncate">
                            <span className="text-[12px] font-semibold text-foreground truncate leading-tight">
                                {user?.nombre}
                            </span>
                            <span className="text-[11px] text-muted-foreground truncate leading-tight">
                                {user?.email}
                            </span>
                        </div>
                    )}
                </div>
                {expanded && <AdminMenu user={user} />}
            </div>
        </div>
    );
}

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────

export function AdminSidebar({ user }: { user: User }) {
    const [expanded, setExpanded] = useState(true);
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (label: string) => {
        if (!expanded) {
            setExpanded(true);
            setTimeout(
                () => setOpenMenus((p) => ({ ...p, [label]: true })),
                150
            );
        } else {
            setOpenMenus((p) => ({ ...p, [label]: !p[label] }));
        }
    };

    return (
        <TooltipProvider>
            <aside
                className={cn(
                    "hidden md:flex relative h-screen flex-col text-foreground transition-all duration-300 select-none",
                    expanded ? "w-60" : "w-[60px]"
                )}
            >
                {/* Collapse toggle */}
                <button
                    onClick={() => {
                        setExpanded((c) => !c);
                        setOpenMenus({});
                    }}
                    className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground shadow-sm transition-colors outline-none"
                    aria-label={expanded ? "Colapsar menú" : "Expandir menú"}
                >
                    <ChevronRight
                        className={cn(
                            "h-3 w-3 transition-transform duration-300",
                            expanded && "rotate-180"
                        )}
                    />
                </button>

                {/* Logo */}
                <div
                    className={cn(
                        "flex h-14 shrink-0 items-center px-4",
                        expanded ? "justify-start" : "justify-center"
                    )}
                >
                    <Logo />
                </div>



                {/* Nav */}
                <NavList
                    expanded={expanded}
                    openMenus={openMenus}
                    onToggle={toggleMenu}
                />

                {/* User footer */}
                <UserFooter user={user} expanded={expanded} />
            </aside>
        </TooltipProvider>
    );
}

// ─── Mobile Sidebar (Sheet) ───────────────────────────────────────────────────

export function MobileSidebar({ user }: { user: User }) {
    const [open, setOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (label: string) =>
        setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button
                    className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    aria-label="Abrir menú"
                >
                    <Menu className="h-5 w-5" />
                </button>
            </SheetTrigger>

            <SheetContent side="left" className="p-0 w-64 flex flex-col">
                <VisuallyHidden>
                    <SheetTitle>Menú de navegación</SheetTitle>
                </VisuallyHidden>

                {/* Header */}
                <div className="flex h-14 items-center px-4 shrink-0">
                    <Logo />
                </div>



                {/* User info */}
                <div className="px-4 py-3 shrink-0">
                    <p className="text-[13px] font-semibold text-foreground truncate">
                        {user?.nombre}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                        {user?.email}
                    </p>
                </div>



                {/* Nav */}
                <NavList
                    expanded={true}
                    openMenus={openMenus}
                    onToggle={toggleMenu}
                    onClose={() => setOpen(false)}
                    isMobile={true}
                />

                {/* Footer */}
                <div className="border-t border-border p-3 shrink-0">
                    <AdminMenu user={user} />
                </div>
            </SheetContent>
        </Sheet>
    );
}

// Default export (desktop)
export default AdminSidebar;