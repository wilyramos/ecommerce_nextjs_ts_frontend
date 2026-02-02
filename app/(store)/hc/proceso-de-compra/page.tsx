import {
    ShoppingCart,
    CreditCard,
    CheckCircle2,
    Package,
    Truck,
    ShieldCheck,
    ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function ProcesoCompraPage() {
    const pasos = [
        {
            icon: ShoppingCart,
            title: "Selección de productos",
            description: "Explora nuestras categorías y variantes. Una vez encuentres lo que buscas, agrégalo a tu bolsa de compra."
        },
        {
            icon: CreditCard,
            title: "Pago seguro",
            description: "Finaliza tu pedido utilizando Visa, Mastercard, American Express, Mercado Pago o Yape. Procesamos tu pago con cifrado de nivel bancario.",
            extra: ["Cifrado SSL de 256 bits", "Privacidad garantizada"]
        },
        {
            icon: CheckCircle2,
            title: "Confirmación",
            description: "Recibirás un correo electrónico automático con el resumen detallado y número de orden. También podemos notificarte vía WhatsApp."
        },
        {
            icon: Package,
            title: "Preparación",
            description: "Cada dispositivo y accesorio pasa por un control de calidad y un embalaje protector antes de salir de nuestro centro de distribución."
        },
        {
            icon: Truck,
            title: "Envío y Seguimiento",
            description: "Despachamos a nivel nacional. Si estás en Cañete, disfruta de nuestra entrega prioritaria el mismo día.",
            extra: ["Cañete: < 24h", "Provincias: 48h - 72h"]
        }
    ];

    return (
        <section className="max-w-4xl mx-auto px-4 py-12 md:py-20 animate-in fade-in duration-700">
            
            {/* Header Estilo Apple */}
            <header className="mb-16 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-[var(--store-text)] tracking-tight mb-4">
                    Comprar es tan simple <br className="hidden md:block" /> 
                </h1>
                <p className="text-lg text-[var(--store-text-muted)] max-w-2xl leading-relaxed">
                    Hemos diseñado un proceso de compra fluido y transparente para que tu única preocupación sea disfrutar de tu nuevo gadget.
                </p>
            </header>

            {/* Timeline de Pasos */}
            <div className="space-y-12 relative">
                {pasos.map((paso, index) => (
                    <div key={index} className="relative flex gap-6 md:gap-10 group">
                        
                        {/* Línea conectora visual */}
                        {index !== pasos.length - 1 && (
                            <div className="absolute left-6 top-12 bottom-[-48px] w-px bg-[var(--store-border)] hidden md:block" />
                        )}

                        {/* Icono con contenedor Apple */}
                        <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[var(--store-surface)] border border-[var(--store-border)] flex items-center justify-center shadow-sm group-hover:border-[var(--store-primary)] transition-colors duration-300">
                            <paso.icon className="w-6 h-6 text-[var(--store-text)] group-hover:text-[var(--store-primary)] transition-colors" />
                        </div>

                        {/* Contenido */}
                        <div className="pt-2 md:pt-3 flex-1 pb-12 border-b border-[var(--store-border)] last:border-0">
                            <h2 className="text-xl font-bold text-[var(--store-text)] mb-2 tracking-tight">
                                {index + 1}. {paso.title}
                            </h2>
                            <p className="text-[var(--store-text-muted)] leading-relaxed text-sm md:text-base max-w-2xl">
                                {paso.description}
                            </p>
                            
                            {paso.extra && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {paso.extra.map((ex, i) => (
                                        <span key={i} className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-[var(--store-bg)] text-[var(--store-text-muted)] border border-[var(--store-border)]">
                                            {ex}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recomendación Destacada */}
            <div className="mt-20 p-8 md:p-10 rounded-[2.5rem] bg-[var(--store-text)] text-[var(--store-surface)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShieldCheck size={120} />
                </div>
                <div className="relative z-10 max-w-xl">
                    <h3 className="text-2xl font-bold mb-4 tracking-tight">Tu satisfacción es nuestra prioridad.</h3>
                    <p className="text-[var(--store-text-muted)] text-sm md:text-base leading-relaxed mb-6">
                        Recomendamos verificar el estado del empaque al recibirlo. Conserva siempre tu comprobante (boleta o factura) para gestionar garantías de forma rápida a través de nuestro centro de soporte.
                    </p>
                    <Link 
                        href="/hc/contacto-y-soporte" 
                        className="text-[var(--store-primary)] font-semibold flex items-center gap-2 hover:underline"
                    >
                        Contactar a un especialista <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Footer de Página */}
            <footer className="mt-20 text-center space-y-6">
                <p className="text-xs text-[var(--store-text-muted)] font-medium tracking-widest uppercase">
                    GoPhone · Calidad a tu alcance
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-8 py-3 bg-[var(--store-primary)] text-white rounded-full font-semibold text-sm hover:bg-[var(--store-primary-hover)] transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                >
                    Volver a la tienda
                </Link>
            </footer>
        </section>
    );
}