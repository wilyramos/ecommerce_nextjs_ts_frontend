"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroNewArrivals() {
    return (
        <section className="w-full py-6">
            <div className=" mx-auto">

                {/* Contenedor Compacto & Enlace Global */}
                {/* Usamos 'group' para animar el contenido cuando pasas el mouse por el banner */}
                <Link href="/novedades" className="block group relative overflow-hidden bg-[#050505] text-white shadow-lg shadow-black/10 isolate min-h-[300px] md:min-h-[340px] flex items-center justify-center transition-transform duration-500 hover:scale-[1.005]">

                    {/* ==================================================================
              FONDO SUTIL
             ================================================================== */}
                    <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
                        {/* Luz central que se intensifica al hacer hover */}
                        <div
                            className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[80%] h-[150%] rounded-full bg-blue-900/20 blur-[100px] mix-blend-screen opacity-50 transition-opacity duration-700 group-hover:opacity-70"
                        />

                        {/* Textura de ruido */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
                    </div>

                    {/* ==================================================================
              CONTENIDO
             ================================================================== */}
                    <div className="relative z-10 w-full px-6 py-8 flex flex-col items-center text-center">

                        {/* Badge Micro */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-colors group-hover:bg-white/10">
                            <Sparkles className="w-3 h-3 text-blue-300" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-100/90">
                                New Arrivals
                            </span>
                        </div>

                        {/* Título */}
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 text-white">
                            Lo último en <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200 group-hover:to-white transition-all duration-500">tecnología.</span>
                        </h2>

                        {/* Descripción */}
                        <p className="text-sm md:text-base text-gray-400 max-w-lg mb-8 font-light leading-relaxed group-hover:text-gray-300 transition-colors">
                            Descubre los lanzamientos más recientes de Apple, Samsung y audio premium.
                        </p>

                        {/* Botón Simulado (Visualmente es un botón, pero todo el card es el link) */}
                        <div
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-medium text-xs md:text-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            Explorar novedades
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>

                    </div>
                </Link>
            </div>
        </section>
    );
}