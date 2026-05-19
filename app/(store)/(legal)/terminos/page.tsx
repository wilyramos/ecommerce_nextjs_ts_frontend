import { Metadata } from "next";
import { H1, H2, P, Muted } from "@/components/ui/Typography";


export const metadata: Metadata = {
    title: "Términos y Condiciones | GoPhone",
    description: "Conoce los términos y condiciones de uso de nuestra plataforma GoPhone.",
};

export default function TerminosPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 select-none bg-background text-foreground">
            <H1 className="text-2xl md:text-3xl font-black tracking-tight mb-1">
                Términos y Condiciones
            </H1>
            <Muted className="text-xs md:text-sm text-muted-foreground font-medium mb-10">
                Última actualización: 1 de febrero de 2026
            </Muted>

            <div className="space-y-8">
                <section className="scroll-m-20">
                    <H2 className="text-base font-bold border-none pb-0 mb-3 tracking-tight">
                        1. Generalidades
                    </H2>
                    <P className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium m-0 [&:not(:first-child)]:mt-0">
                        Este documento regula el acceso y uso del sitio web de GoPhone. Al utilizar nuestros servicios, aceptas estos términos en su totalidad.
                    </P>
                </section>

                <section className="scroll-m-20">
                    <H2 className="text-base font-bold border-none pb-0 mb-3 tracking-tight">
                        2. Propiedad Intelectual
                    </H2>
                    <P className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium m-0 [&:not(:first-child)]:mt-0">
                        Todo el contenido presente en este sitio, incluyendo marcas, logos, textos e imágenes, es propiedad de GoPhone o de sus proveedores y está protegido por las leyes de propiedad intelectual.
                    </P>
                </section>

                <section className="scroll-m-20">
                    <H2 className="text-base font-bold border-none pb-0 mb-3 tracking-tight">
                        3. Envíos y Entregas
                    </H2>
                    <P className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium m-0 [&:not(:first-child)]:mt-0">
                        Los tiempos de envío pueden variar según la ubicación. GoPhone se compromete a despachar los productos en los plazos establecidos, pero no se responsabiliza por retrasos ajenos a nuestra gestión logística.
                    </P>
                </section>
            </div>
        </div>
    );
}