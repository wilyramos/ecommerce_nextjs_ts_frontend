// File: components/admin/AdminSidebar.tsx
"use client";

import { User } from "@/src/schemas";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import AdminMenu from "./AdminMenu";
import Logo from "../ui/Logo";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
    ShoppingBag,
    Receipt, BarChart3,
    ShieldCheck,
    MonitorSmartphone,
    ChevronRight,
    ChevronDown,
    Menu,
    AlertCircle, Users,
    UserCircle, ShoppingCart,
    Settings,
    Truck,
    LayoutTemplate
} from "lucide-react";

type SubItem = {
    href: string;
    label: string;
    badge?: string;
};

type NavItemType = {
    href?: string;
    icon: React.ElementType;
    label: string;
    badge?: string;
    children?: SubItem[];
    external?: boolean;
};

type NavSection = {
    title?: string;
    items: NavItemType[];
};

// ─── ESTRUCTURA NAVEGACIÓN AGRUPADA ESTILO SHOPIFY ────────────────────────────

const navigationSections: NavSection[] = [
    {
        title: "Ventas & Operaciones",
        items: [
            { href: "/admin/orders-v2", icon: Receipt, label: "Órdenes" },
            { 
                href: "/admin/abandoned-carts", 
                icon: ShoppingCart, 
                label: "Carritos Abandonados", 
                badge: "Próx." 
            },
            { href: "/admin/claims", icon: AlertCircle, label: "Libro de Reclamos" },
            { href: "/pos", icon: MonitorSmartphone, label: "Punto de Venta", external: true },
        ],
    },
    {
        title: "Catálogo",
        items: [
            {
                icon: ShoppingBag,
                label: "Productos",
                children: [
                    { href: "/admin/products", label: "Todos los productos" },
                    { href: "/admin/inventory", label: "Inventario & Stock", badge: "Próx." },
                    { href: "/admin/products/category", label: "Categorías" },
                    { href: "/admin/collections", label: "Colecciones" },
                    { href: "/admin/brands", label: "Marcas" },
                    { href: "/admin/lines", label: "Líneas" },
                    { href: "/admin/comparisons", label: "Comparativas" },
                ],
            },
        ],
    },
    {
        title: "Clientes",
        items: [
            { 
                icon: Users, 
                label: "Clientes & CRM", 
                children: [
                    { href: "/admin/customers", label: "Lista de Clientes", badge: "Próx." },
                    { href: "/admin/customers/segments", label: "Segmentos", badge: "Próx." }
                ] 
            },
        ],
    },
    {
        title: "Contenido & Marketing",
        items: [
            {
                icon: LayoutTemplate,
                label: "Contenido y Marketing",
                children: [
                    { href: "/admin/slider", label: "Slider Principal" },
                    { href: "/admin/advertisements", label: "Avisos & Banners" },
                    { href: "/admin/sections", label: "Secciones del Home" },
                    { href: "/admin/pages", label: "Páginas Estáticas" },
                    { href: "/admin/media", label: "Biblioteca de Medios" },
                    { href: "/admin/discounts", label: "Cupones & Descuentos", badge: "Próx." },
                ],
            },
        ],
    },
    {
        title: "Analítica",
        items: [
            {
                icon: BarChart3,
                label: "Reportes",
                children: [
                    { href: "/admin/reports/sales/products", label: "Ventas por Producto" },
                    { href: "/admin/reports/sales/vendors", label: "Ventas por Vendedor" },
                    { href: "/admin/reports/orders/status", label: "Estado de Órdenes" },
                    { href: "/admin/reports/orders/payments", label: "Reporte de Pagos" },
                ],
            },
        ],
    },
    {
        title: "Ajustes del Sistema",
        items: [
            {
                icon: ShieldCheck,
                label: "Usuarios",
                children: [{ href: "/admin/users", label: "Gestión de Usuarios" }],
            },
            { href: "/admin/shipping", icon: Truck, label: "Métodos de Envío", badge: "Próx." },
            { href: "/admin/settings", icon: Settings, label: "Configuración Tienda", badge: "Próx." },
            { href: "/admin/profile", icon: UserCircle, label: "Mi Perfil" },
        ],
    },
];

// ─── DESKTOP NAV ITEM ─────────────────────────────────────────────────────────

function NavItem({
    item,
    expanded,
    openMenus,
    onToggle,
    pathname,
}: {
    item: NavItemType;
    expanded: boolean;
    openMenus: Record<string, boolean>;
    onToggle: (label: string) => void;
    pathname: string;
}) {
    const { href, icon: Icon, label, children, external, badge } = item;

    if (children) {
        const isOpen = openMenus[label];
        const isChildActive = children.some((c) => pathname.startsWith(c.href));

        return (
            <div className="space-y-0.5">
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <button
                            onClick={() => onToggle(label)}
                            className={cn(
                                "group flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors outline-none",
                                isChildActive
                                    ? "bg-muted text-foreground font-semibold"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                        >
                            <div className="flex items-center gap-2.5 min-w-0">
                                <Icon className="h-4 w-4 shrink-0" />
                                <span className={cn("transition-opacity duration-200 truncate", expanded ? "opacity-100" : "opacity-0 hidden")}>
                                    {label}
                                </span>
                            </div>
                            {expanded && (
                                <div className="flex items-center gap-1.5 shrink-0 ml-1">
                                    {badge && <Badge variant="neutral" size="sm">{badge}</Badge>}
                                    <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground/60 transition-transform duration-200", isOpen && "rotate-180")} />
                                </div>
                            )}
                        </button>
                    </TooltipTrigger>
                    {!expanded && (
                        <TooltipContent side="right" className="text-xs font-medium">
                            {label} {badge && `(${badge})`}
                        </TooltipContent>
                    )}
                </Tooltip>

                <div className={cn("grid overflow-hidden transition-all duration-200 ease-in-out", isOpen && expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                    <div className="min-h-0 pl-6 pr-1">
                        <div className="border-l border-border pl-2 space-y-0.5 py-1">
                            {children.map((sub) => {
                                const isActive = pathname === sub.href;
                                return (
                                    <Link
                                        key={sub.href}
                                        href={sub.href}
                                        className={cn(
                                            "flex items-center justify-between rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors outline-none truncate",
                                            isActive 
                                                ? "text-primary font-semibold bg-primary/10" 
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                                        )}
                                    >
                                        <span className="truncate">{sub.label}</span>
                                        {sub.badge && <Badge variant="neutral" size="sm" className="ml-1 shrink-0">{sub.badge}</Badge>}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const isActive = href && (pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`)));

    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
                <Link
                    href={href!}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className={cn(
                        "group flex items-center justify-between rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors outline-none",
                        isActive 
                            ? "bg-primary text-primary-foreground font-semibold shadow-sm" 
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                >
                    <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className={cn("transition-opacity duration-200 truncate", expanded ? "opacity-100" : "opacity-0 hidden")}>
                            {label}
                        </span>
                    </div>
                    {expanded && badge && (
                        <Badge variant="neutral" size="sm" className="ml-1 shrink-0">{badge}</Badge>
                    )}
                </Link>
            </TooltipTrigger>
            {!expanded && (
                <TooltipContent side="right" className="text-xs font-medium">
                    {label} {badge && `(${badge})`}
                </TooltipContent>
            )}
        </Tooltip>
    );
}

// ─── MOBILE NAV ITEM ──────────────────────────────────────────────────────────

function MobileNavItem({
    item,
    pathname,
    openMenus,
    onToggle,
    onClose,
}: {
    item: NavItemType;
    pathname: string;
    openMenus: Record<string, boolean>;
    onToggle: (label: string) => void;
    onClose: () => void;
}) {
    const { href, icon: Icon, label, children, external, badge } = item;

    if (children) {
        const isOpen = openMenus[label];
        const isChildActive = children.some((c) => pathname.startsWith(c.href));

        return (
            <div>
                <button
                    onClick={() => onToggle(label)}
                    className={cn(
                        "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isChildActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left truncate">{label}</span>
                    {badge && <Badge variant="neutral" size="sm" className="mr-1">{badge}</Badge>}
                    {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground/60" /> : <ChevronRight className="h-4 w-4 text-muted-foreground/60" />}
                </button>

                {isOpen && (
                    <div className="ml-6 mt-0.5 border-l border-border pl-2.5 space-y-0.5 py-1">
                        {children.map((sub) => {
                            const isActive = pathname === sub.href;
                            return (
                                <Link
                                    key={sub.href}
                                    href={sub.href}
                                    onClick={onClose}
                                    className={cn(
                                        "flex items-center justify-between rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                                        isActive ? "text-primary font-semibold bg-primary/10" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <span className="truncate">{sub.label}</span>
                                    {sub.badge && <Badge variant="neutral" size="sm">{sub.badge}</Badge>}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    const isActive = href && (pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`)));

    return (
        <Link
            href={href!}
            onClick={onClose}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
        >
            <div className="flex items-center gap-2.5 min-w-0">
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{label}</span>
            </div>
            {badge && <Badge variant="neutral" size="sm">{badge}</Badge>}
        </Link>
    );
}

// ─── NAV LIST GENERATOR CON CABECERAS DE SECCIÓN ──────────────────────────────

type NavListProps = {
    expanded: boolean;
    openMenus: Record<string, boolean>;
    onToggle: (label: string) => void;
    onClose?: () => void;
    isMobile?: boolean;
};

function NavList({ expanded, openMenus, onToggle, onClose, isMobile = false }: NavListProps) {
    const pathname = usePathname();

    return (
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4 scrollbar-none">
            {navigationSections.map((section, idx) => (
                <div key={section.title || idx} className="space-y-1">
                    {section.title && expanded && (
                        <h4 className="px-2 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider select-none mb-1">
                            {section.title}
                        </h4>
                    )}

                    {section.title && !expanded && idx > 0 && (
                        <div className="my-2 border-t border-border/60 mx-1" />
                    )}

                    {section.items.map((item, i) => (
                        <div key={`${item.label}-${i}`}>
                            {isMobile ? (
                                <MobileNavItem item={item} pathname={pathname} openMenus={openMenus} onToggle={onToggle} onClose={onClose ?? (() => {})} />
                            ) : (
                                <NavItem item={item} expanded={expanded} openMenus={openMenus} onToggle={onToggle} pathname={pathname} />
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </nav>
    );
}

// ─── USER FOOTER ──────────────────────────────────────────────────────────────

function UserFooter({ user, expanded }: { user: User; expanded: boolean }) {
    return (
        <div className="border-t border-border p-2 bg-card">
            <div className={cn("flex items-center gap-2 rounded-md p-1.5 hover:bg-muted/50 transition-colors", expanded ? "justify-between" : "justify-center")}>
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0 border border-border">
                        {user?.nombre?.charAt(0).toUpperCase() || "A"}
                    </div>
                    {expanded && (
                        <div className="flex flex-col truncate">
                            <span className="text-[12px] font-semibold text-foreground truncate leading-tight">{user?.nombre}</span>
                            <span className="text-[10px] text-muted-foreground truncate leading-tight">{user?.email}</span>
                        </div>
                    )}
                </div>
                {expanded && <AdminMenu user={user} />}
            </div>
        </div>
    );
}

// ─── DESKTOP SIDEBAR COMPONENT ────────────────────────────────────────────────

export function AdminSidebar({ user }: { user: User }) {
    const [expanded, setExpanded] = useState(true);
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
        Productos: true, // Abierto por defecto
        "Contenido y Marketing": true, // Abierto por defecto
    });

    const toggleMenu = (label: string) => {
        if (!expanded) {
            setExpanded(true);
            setTimeout(() => setOpenMenus((p) => ({ ...p, [label]: true })), 150);
        } else {
            setOpenMenus((p) => ({ ...p, [label]: !p[label] }));
        }
    };

    return (
        <TooltipProvider>
            <div className={cn("flex h-full flex-col text-foreground transition-all duration-300 select-none border-r border-border bg-card relative", expanded ? "w-60" : "w-[60px]")}>
                {/* Botón Colapsar */}
                <button
                    onClick={() => {
                        setExpanded((c) => !c);
                        setOpenMenus({});
                    }}
                    className="absolute -right-3 top-5 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground shadow-sm transition-colors outline-none"
                    aria-label={expanded ? "Colapsar menú" : "Expandir menú"}
                >
                    <ChevronRight className={cn("h-3 w-3 transition-transform duration-300", expanded && "rotate-180")} />
                </button>

                {/* Logo */}
                <div className={cn("flex h-14 shrink-0 items-center px-3.5 border-b border-border/40", expanded ? "justify-start" : "justify-center")}>
                    <Logo />
                </div>

                {/* Enlaces */}
                <NavList expanded={expanded} openMenus={openMenus} onToggle={toggleMenu} />

                {/* Usuario Footer */}
                <UserFooter user={user} expanded={expanded} />
            </div>
        </TooltipProvider>
    );
}

// ─── MOBILE SIDEBAR COMPONENT ─────────────────────────────────────────────────

export function MobileSidebar({ user }: { user: User }) {
    const [open, setOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
        Productos: true,
        "Contenido y Marketing": true,
    });

    const toggleMenu = (label: string) => setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" aria-label="Abrir menú">
                    <Menu className="h-5 w-5" />
                </button>
            </SheetTrigger>

            <SheetContent side="left" className="p-0 w-64 flex flex-col">
                <VisuallyHidden>
                    <SheetTitle>Menú de navegación</SheetTitle>
                </VisuallyHidden>

                <div className="flex h-14 items-center px-4 shrink-0 border-b border-border">
                    <Logo />
                </div>

                <div className="px-4 py-2.5 shrink-0 border-b border-border/50 bg-muted/30">
                    <p className="text-[12px] font-semibold text-foreground truncate">{user?.nombre}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                </div>

                <NavList expanded={true} openMenus={openMenus} onToggle={toggleMenu} onClose={() => setOpen(false)} isMobile={true} />

                <div className="border-t border-border p-2 shrink-0">
                    <AdminMenu user={user} />
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default AdminSidebar;