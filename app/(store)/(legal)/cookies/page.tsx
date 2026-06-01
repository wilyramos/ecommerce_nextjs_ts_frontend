// File: frontend/app/(store)/(legal)/cookies/page.tsx

import { Metadata } from "next";
import { H1, H2, Muted, P } from "@/components/ui/Typography";

export const metadata: Metadata = {
    title: "Política de Cookies | GoPhone",
    description: "Información transparente sobre el uso de cookies en el sitio web de GoPhone para mejorar tu experiencia de compra.",
};

export default function CookiesPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 select-none bg-background text-foreground">
            <H1 className="text-2xl md:text-3xl font-black tracking-tight mb-1">
                Política de Cookies
            </H1>
            <Muted className="text-xs md:text-sm text-muted-foreground font-medium mb-10">
                Última actualización: Junio 2026
            </Muted>

            <div className="space-y-8">
                <section>
                    <H2 className="text-base font-bold border-none pb-0 mb-3 tracking-tight">
                        ¿Qué son las cookies?
                    </H2>
                    <P className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium">
                        Las cookies son pequeños archivos de datos que se descargan en tu terminal (computadora, smartphone o tablet) 
                        al acceder a nuestro sitio web. Nos permiten almacenar y recuperar información sobre tus hábitos de navegación 
                        para mejorar la calidad de nuestra tienda y tu experiencia de usuario.
                    </P>
                </section>

                <section>
                    <H2 className="text-base font-bold border-none pb-0 mb-3 tracking-tight">
                        Tipos de cookies que usamos
                    </H2>
                    <ul className="space-y-3 text-xs md:text-sm text-muted-foreground font-medium pl-0 list-none">
                        <li className="flex gap-2">
                            <span className="text-action-cta">•</span>
                            <span><strong className="font-bold text-foreground">Esenciales (Técnicas):</strong> Estrictamente necesarias para el correcto funcionamiento del sitio. Permiten mantener tu sesión abierta y gestionar el carrito de compras. No pueden desactivarse.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-action-cta">•</span>
                            <span><strong className="font-bold text-foreground">Analíticas (Google Analytics):</strong> Nos permiten cuantificar el número de usuarios y medir estadísticamente el uso de nuestra web para realizar mejoras.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-action-cta">•</span>
                            <span><strong className="font-bold text-foreground">Marketing y Personalización:</strong> Recopilan información sobre tus preferencias en nuestra tienda para ofrecerte anuncios y ofertas relevantes dentro y fuera de nuestro sitio.</span>
                        </li>
                    </ul>
                </section>

                <section>
                    <H2 className="text-base font-bold border-none pb-0 mb-3 tracking-tight">
                        Gestión y Desactivación
                    </H2>
                    <P className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium">
                        Puedes configurar tu navegador para aceptar o rechazar todas las cookies, o recibir un aviso en pantalla sobre la recepción de cada cookie. 
                        A continuación te indicamos cómo gestionar las cookies en los navegadores más comunes:
                    </P>
                    <ul className="mt-3 list-disc pl-5 text-xs md:text-sm text-muted-foreground font-medium space-y-1">
                        <li>Google Chrome: Configuración &gt; Privacidad y seguridad &gt; Cookies.</li>
                        <li>Mozilla Firefox: Preferencias &gt; Privacidad y seguridad &gt; Cookies y sitios web.</li>
                        <li>Safari: Preferencias &gt; Privacidad &gt; Cookies.</li>
                    </ul>
                    <P className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium mt-3">
                        Ten en cuenta que, si desactivas las cookies técnicas, es posible que el sitio web no funcione correctamente 
                        o que no puedas realizar compras.
                    </P>
                </section>

                <section>
                    <H2 className="text-base font-bold border-none pb-0 mb-3 tracking-tight">
                        Consentimiento
                    </H2>
                    <P className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium">
                        Al navegar por nuestro sitio web tras haber sido informado sobre el uso de cookies, entendemos que das tu consentimiento 
                        para su uso según los términos establecidos en esta política, salvo que las hayas desactivado expresamente. 
                        GoPhone se reserva el derecho de actualizar esta política para cumplir con cambios legislativos.
                    </P>
                </section>
            </div>
        </div>
    );
}