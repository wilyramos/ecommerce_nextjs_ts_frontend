import { Metadata } from "next";
import { H1, H2, Muted, P } from "@/components/ui/Typography";

export const metadata: Metadata = {
    title: "Política de Cookies | GoPhone",
    description: "Información sobre el uso de cookies en el sitio web de GoPhone.",
};

export default function CookiesPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 select-none bg-background text-foreground">
            <H1 className="text-2xl md:text-3xl font-black tracking-tight mb-1">
                Política de Cookies
            </H1>
            <Muted className="text-xs md:text-sm text-muted-foreground font-medium mb-10">
                Cómo protegemos tu experiencia digital.
            </Muted>

            <div className="space-y-8">
                <section className="scroll-m-20">
                    <H2 className="text-base font-bold border-none pb-0 mb-3 tracking-tight">
                        ¿Qué son las cookies?
                    </H2>
                    <P className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium m-0 [&:not(:first-child)]:mt-0">
                        Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo para mejorar la navegación y personalizar tu experiencia en nuestra tienda.
                    </P>
                </section>

                <section className="scroll-m-20">
                    <H2 className="text-base font-bold border-none pb-0 mb-3 tracking-tight">
                        Tipos de cookies que usamos
                    </H2>
                    <ul className="space-y-2.5 text-xs md:text-sm text-muted-foreground font-medium pl-0 list-none">
                        <li className="flex gap-2">
                            <span className="text-action-cta">•</span>
                            <span><strong className="font-bold text-foreground">Esenciales:</strong> Necesarias para el funcionamiento del carrito de compras y el inicio de sesión.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-action-cta">•</span>
                            <span><strong className="font-bold text-foreground">Analíticas:</strong> Nos ayudan a entender cómo los usuarios interactúan con el sitio (Google Analytics).</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-action-cta">•</span>
                            <span><strong className="font-bold text-foreground">Marketing:</strong> Utilizadas para mostrarte ofertas relevantes basadas en tus intereses.</span>
                        </li>
                    </ul>
                </section>

                <section className="scroll-m-20">
                    <H2 className="text-base font-bold border-none pb-0 mb-3 tracking-tight">
                        Gestión de Cookies
                    </H2>
                    <P className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium m-0 [&:not(:first-child)]:mt-0">
                        Puedes desactivar las cookies en cualquier momento desde la configuración de tu navegador. Ten en cuenta que esto podría afectar algunas funcionalidades de la tienda.
                    </P>
                </section>
            </div>
        </div>
    );
}