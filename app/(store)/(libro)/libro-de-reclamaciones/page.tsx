// File: app/(store)/libro-de-reclamaciones/page.tsx

import { Metadata } from "next";
import ClaimForm from "@/components/claim/ClaimForm";
import { H1, Muted } from "@/components/ui/Typography";
import { FaBookOpen } from "react-icons/fa";

export const metadata: Metadata = {
    title: "Libro de Reclamaciones Virtual | GoPhone",
    description: "Libro de Reclamaciones Virtual de GoPhone, conforme a la Ley N.° 29571 - Código de Protección y Defensa del Consumidor.",
};

const COMPANY_INFO = {
    nombre: "GOPHONE",
    ruc: "10725169715",
    direccion: "Jr. Bernardo O'Higgins 120, San Vicente de Cañete, Lima",
};

export default function LibroReclamacionesPage() {
    return (
        <main className="min-h-screen bg-background text-foreground space-y-6 px-4 py-8">
            <header className="text-center space-y-3 border-b border-border pb-6 select-none">
                <div className="flex items-center justify-center gap-3">
                    <FaBookOpen className="text-amber-500 text-3xl shrink-0" />
                    <H1>Libro de Reclamaciones Virtual</H1>
                </div>

                <Muted className="max-w-2xl mx-auto font-medium">
                    Conforme a la Ley N.° 29571 – Código de Protección y Defensa del Consumidor y al Reglamento del Libro de Reclamaciones aprobado mediante D.S. N.° 011-2011-PCM.
                </Muted>

                <div className="rounded-lg border border-border bg-secondary/50 p-5 text-left text-xs font-medium leading-relaxed space-y-3 max-w-3xl mx-auto text-muted-foreground">
                    <p className="text-foreground font-bold border-b border-border/50 pb-2 mb-3">
                        Proveedor: {COMPANY_INFO.nombre} | RUC: {COMPANY_INFO.ruc} | Dirección: {COMPANY_INFO.direccion}
                    </p>
                    
                    <p className="text-foreground">
                        Este establecimiento cuenta con un Libro de Reclamaciones Virtual a disposición de los consumidores, 
                        donde podrá registrar sus reclamos o quejas respecto a los productos o servicios ofrecidos por {COMPANY_INFO.nombre}.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <p>
                            <strong className="text-foreground uppercase tracking-wider block text-[11px]">Reclamo:</strong> 
                            Disconformidad relacionada con los productos o servicios adquiridos en nuestra plataforma.
                        </p>
                        <p>
                            <strong className="text-foreground uppercase tracking-wider block text-[11px]">Queja:</strong> 
                            Disconformidad no relacionada a los productos o servicios; o malestar respecto a la atención brindada al público.
                        </p>
                    </div>

                    <p>
                        La formulación del reclamo o queja no impide acudir a otras vías de solución de controversias ni constituye una denuncia ante el INDECOPI.
                    </p>

                    <p>
                        El proveedor deberá brindar respuesta al reclamo o queja en un plazo máximo de <strong>quince (15) días hábiles</strong>, 
                        improrrogables, conforme a la normativa legal vigente.
                    </p>

                    <p>
                        El tratamiento de los datos personales proporcionados se realizará estrictamente conforme a la Ley N.° 29733 – Ley de Protección de Datos Personales.
                    </p>
                </div>
            </header>

            <section className="max-w-3xl mx-auto">
                <ClaimForm />
            </section>
        </main>
    );
}