import {
    ShoppingCart,
    CreditCard,
    CheckCircle2,
    Package,
    Truck,
    ShieldCheck,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";

const pasos = [
    {
        icon: ShoppingCart,
        title: "Elige tus productos",
        description:
            "Explora nuestro catálogo, selecciona variantes de color, talla o modelo y agrégalos a tu bolsa.",
    },
    {
        icon: CreditCard,
        title: "Paga de forma segura",
        description:
            "Aceptamos Visa, Mastercard, American Express, Mercado Pago y Yape. Tu información viaja cifrada con SSL de 256 bits.",
        tags: ["SSL 256 bits", "Datos protegidos"],
    },
    {
        icon: CheckCircle2,
        title: "Recibe tu confirmación",
        description:
            "Te enviamos un correo con el resumen y número de orden. También podemos notificarte por WhatsApp.",
    },
    {
        icon: Package,
        title: "Preparamos tu pedido",
        description:
            "Cada producto pasa por control de calidad y se embala de forma segura antes de salir de nuestro almacén.",
    },
    {
        icon: Truck,
        title: "Enviamos a todo el país",
        description:
            "Despacho nacional con seguimiento en tiempo real. Si estás en Cañete, recibes tu pedido el mismo día.",
        tags: ["Cañete: mismo día", "Provincias: 48–72 h"],
    },
];

export default function ProcesoCompraPage() {
    return (
        <section className="max-w-3xl mx-auto px-4 py-12 md:py-20">

            {/* ── HEADER ── */}
            <header className="mb-12 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Cómo comprar
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight">
                    Tu pedido en 5 pasos simples
                </h1>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
                    Diseñamos cada etapa para que sea rápida, clara y sin sorpresas.
                </p>
            </header>

            {/* ── TIMELINE ── */}
            <ol className="relative space-y-0">
                {pasos.map((paso, index) => {
                    const Icon = paso.icon;
                    const isLast = index === pasos.length - 1;

                    return (
                        <li key={index} className="relative flex gap-5">

                            {/* Columna izquierda: número + línea */}
                            <div className="flex flex-col items-center">
                                <div className="w-9 h-9 shrink-0 rounded-full border border-border bg-background-secondary flex items-center justify-center z-10">
                                    <Icon size={16} className="text-foreground" />
                                </div>
                                {!isLast && (
                                    <div className="w-px flex-1 bg-border/60 my-1" />
                                )}
                            </div>

                            {/* Contenido */}
                            <div className={`pb-8 flex-1 ${isLast ? "" : ""}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-bold text-muted-foreground tabular-nums">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <h2 className="text-sm font-bold text-foreground">
                                        {paso.title}
                                    </h2>
                                </div>
                                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                                    {paso.description}
                                </p>
                                {paso.tags && (
                                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                                        {paso.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="text-[10px] font-semibold px-2 py-0.5 bg-background-secondary border border-border text-muted-foreground rounded-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ol>

            {/* ── BANNER GARANTÍA ── */}
            <div className="mt-10 border border-border rounded-sm p-6 md:p-8 bg-background-secondary flex flex-col md:flex-row gap-5 md:items-start">
                <ShieldCheck size={28} className="text-foreground shrink-0 mt-0.5" />
                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-foreground">
                        Tu compra está respaldada
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                        Todos nuestros productos son{" "}
                        <span className="font-semibold text-foreground">100% originales</span> con
                        garantía de{" "}
                        <span className="font-semibold text-foreground">12 meses</span> por fallas
                        de origen. Conserva tu boleta o factura para gestionar cambios sin
                        contratiempos.
                    </p>
                    <Link
                        href="/hc/contacto-y-soporte"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-action-cta hover:text-action-cta-hover transition-colors group/link mt-1"
                    >
                        Hablar con un especialista
                        <ArrowRight size={13} className="group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* ── FOOTER ── */}
            <footer className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground font-medium">
                    GoPhone · Calidad a tu alcance
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-5 py-2 bg-foreground text-background text-xs font-semibold rounded-sm hover:opacity-90 transition-opacity active:scale-95"
                >
                    Volver a la tienda
                    <ArrowRight size={13} />
                </Link>
            </footer>
        </section>
    );
}