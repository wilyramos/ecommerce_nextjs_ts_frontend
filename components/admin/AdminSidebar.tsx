"use client";

import { User } from "@/src/schemas";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import AdminMenu from "./AdminMenu";
import Logo from "../ui/Logo";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Smartphone, Receipt,
    Images,
    Layers,
    Bookmark,
    GitFork,
    Folder,
    Library,
    BarChart,
    ShieldCheck,
    MonitorSmartphone,
    ChevronDown,
    ChevronRight
} from "lucide-react";

type Props = { user: User };

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
    { href: "/admin/slider", icon: Images, label: "Slider" },
    { href: "/admin/comparisons", icon: Layers, label: "Comparativas" },
    { href: "/admin/collections", icon: Library, label: "Colecciones" },
    { href: "/admin/media", icon: Images, label: "Medios" },
    { href: "/admin/claims", icon: Layers, label: "Reclamos" },

    // --- CATÁLOGO ---
    { href: "/admin/brands", icon: Bookmark, label: "Marcas" },
    { href: "/admin/lines", icon: GitFork, label: "Líneas" },
    { href: "/admin/products/category", icon: Folder, label: "Categorías" },

    { href: "/admin/reports", icon: BarChart, label: "Reportes" },
    {
        icon: ShieldCheck,
        label: "Usuarios",
        children: [
            { href: "/admin/users", label: "Lista de usuarios" },
        ],
    },
    { href: "/pos", icon: MonitorSmartphone, label: "Punto de Venta", external: true },
];

export default function AdminSidebar({ user }: Props) {
    const pathname = usePathname();
    const [expanded, setExpanded] = useState(true);
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (label: string) => {
        if (!expanded) {
            setExpanded(true);
            setTimeout(() => setOpenMenus((p) => ({ ...p, [label]: true })), 150);
        } else setOpenMenus((p) => ({ ...p, [label]: !p[label] }));
    };

    return (
        <TooltipProvider>
            <aside
                className={cn(
                    "hidden md:flex relative h-screen flex-col border-r border-border bg-background text-foreground transition-all duration-300 select-none",
                    expanded ? "w-64" : "w-[72px]"
                )}
            >
                {/* Botón Colapsar */}
                <button
                    onClick={() => {
                        setExpanded((c) => !c);
                        setOpenMenus({});
                    }}
                    className="absolute -right-3 top-7 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground shadow-xs transition-colors outline-none"
                >
                    <ChevronRight className={cn("h-3 w-3 transition-transform duration-300", expanded && "rotate-180")} />
                </button>

                {/* Logo Area */}
                <div className={cn("flex h-16 items-center px-4 transition-all", expanded ? "justify-start" : "justify-center")}>
                    <div className={cn("transition-transform duration-300", expanded ? "scale-100" : "scale-90")}>
                        <Logo />
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-4 scrollbar-none">
                    {links.map((item) => {
                        const { href, icon: Icon, label, children, external } = item;

                        if (children) {
                            const isOpen = openMenus[label];
                            const isChildActive = children.some((c) => c.href === pathname);

                            return (
                                <div key={label} className="space-y-0.5">
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={() => toggleMenu(label)}
                                                className={cn(
                                                    "group flex w-full items-center justify-between rounded-sm px-3 py-2 text-[13px] font-medium transition-colors outline-none",
                                                    isChildActive
                                                        ? "bg-background-secondary text-foreground font-semibold"
                                                        : "text-muted-foreground hover:bg-background-secondary/60 hover:text-foreground"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon className="h-4 w-4 shrink-0" />
                                                    <span className={cn("transition-opacity duration-200", expanded ? "opacity-100" : "opacity-0 hidden")}>{label}</span>
                                                </div>
                                                {expanded && (
                                                    <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground/60 transition-transform duration-200", isOpen && "rotate-180")} />
                                                )}
                                            </button>
                                        </TooltipTrigger>
                                        {!expanded && <TooltipContent side="right" className="bg-foreground text-background border-none text-xs rounded-sm font-medium">{label}</TooltipContent>}
                                    </Tooltip>

                                    {/* Submenú Animado */}
                                    <div
                                        className={cn(
                                            "grid overflow-hidden transition-all duration-200 ease-in-out",
                                            isOpen && expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
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
                                                                "block rounded-sm px-3 py-1.5 text-[12px] font-medium transition-colors outline-none",
                                                                isActive
                                                                    ? "text-action-cta font-bold"
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

                        const isActive = href && (pathname === href || pathname.startsWith(`${href}/`));

                        return (
                            <Tooltip key={label} delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={href!}
                                        target={external ? "_blank" : undefined}
                                        rel={external ? "noopener noreferrer" : undefined}
                                        className={cn(
                                            "group flex items-center gap-3 rounded-sm px-3 py-2 text-[13px] font-medium transition-colors outline-none",
                                            isActive
                                                ? "bg-foreground text-background font-bold shadow-2xs"
                                                : "text-muted-foreground hover:text-foreground hover:bg-background-secondary/60"
                                        )}
                                    >
                                        <Icon className="h-4 w-4 shrink-0" />
                                        <span className={cn("transition-opacity duration-200", expanded ? "opacity-100" : "opacity-0 hidden")}>{label}</span>
                                    </Link>
                                </TooltipTrigger>
                                {!expanded && <TooltipContent side="right" className="bg-foreground text-background border-none text-xs rounded-sm font-medium">{label}</TooltipContent>}
                            </Tooltip>
                        );
                    })}
                </nav>

                {/* Footer Usuario */}
                <div className="border-t border-border p-3 bg-background">
                    <div className={cn("flex items-center gap-3 rounded-sm p-1.5 transition-colors hover:bg-background-secondary/60 cursor-pointer", expanded ? "justify-between" : "justify-center")}>
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="h-8 w-8 rounded-full bg-background-secondary flex items-center justify-center text-xs font-bold text-foreground border border-border shrink-0">
                                {user?.nombre?.charAt(0).toUpperCase()}
                            </div>
                            {expanded && (
                                <div className="flex flex-col truncate">
                                    <span className="text-[12px] font-bold text-foreground truncate leading-none mb-0.5">{user?.nombre}</span>
                                    <span className="text-[10px] text-muted-foreground truncate leading-none">{user?.email}</span>
                                </div>
                            )}
                        </div>

                        {expanded && <AdminMenu user={user} />}
                    </div>
                </div>
            </aside>
        </TooltipProvider>
    );
}