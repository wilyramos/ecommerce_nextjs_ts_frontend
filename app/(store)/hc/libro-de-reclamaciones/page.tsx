// File: app/%28store%29/hc/libro-de-reclamaciones/page.tsx

import { Metadata } from "next";
import ClaimForm from "@/components/claim/ClaimForm";
import { H1, Muted } from "@/components/ui/Typography";
import { FaBookOpen } from "react-icons/fa";


export const metadata: Metadata = {
    title: "Libro de Reclamaciones Virtual",
    description:
        "Conforme a lo establecido en la Ley N.° 29571 - Código de Protección y Defensa del Consumidor y el D.S. N.° 011-2011-PCM, ponemos a su disposición nuestro Libro de Reclamaciones Virtual.",
};

export default function LibroReclamacionesPage() {
    return (
        <main className="min-h-screen bg-background text-foreground space-y-6">
            <header className="text-center space-y-3 border-b border-border pb-6 select-none">
                <div className="flex items-center justify-center gap-3">
                    <FaBookOpen className="text-amber-500 text-3xl shrink-0" />
                    <H1>Libro de Reclamaciones Virtual</H1>
                </div>

                <Muted className="max-w-2xl mx-auto font-medium">
                    Conforme a la Ley N.° 29571 – Código de Protección y Defensa
                    del Consumidor y al Reglamento del Libro de Reclamaciones
                    aprobado mediante D.S. N.° 011-2011-PCM.
                </Muted>

                <div className="rounded-[var(--radius-lg)] border border-border bg-background-secondary p-5 text-left text-xs font-semibold leading-relaxed space-y-3 max-w-3xl mx-auto text-muted-foreground">
                    <p className="text-foreground font-bold">
                        Este establecimiento cuenta con un Libro de
                        Reclamaciones Virtual a disposición de los consumidores,
                        donde podrá registrar sus reclamos o quejas respecto a
                        los productos o servicios ofrecidos.
                    </p>

                    <p>
                        <strong className="text-foreground uppercase tracking-wider text-[11px]">Reclamo:</strong> Disconformidad relacionada con los productos o servicios adquiridos en plataforma.
                    </p>

                    <p>
                        <strong className="text-foreground uppercase tracking-wider text-[11px]">Queja:</strong> Disconformidad no relacionada a los productos o servicios; o malestar respecto a la atención brindada al público.
                    </p>

                    <p>
                        La formulación del reclamo o queja no impide acudir a otras vías de solución de controversias ni constituye una denuncia ante el INDECOPI.
                    </p>

                    <p>
                        El proveedor deberá brindar respuesta al reclamo o queja en un plazo máximo de quince (15) días hábiles, improrrogables, conforme a la normativa legal vigente.
                    </p>

                    <p>
                        El tratamiento de los datos personales proporcionados se realizará estrictamente conforme a la Ley N.° 29733 – Ley de Protección de Datos Personales.
                    </p>
                </div>
            </header>

            <ClaimForm />
        </main>
    );
}