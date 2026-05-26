"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroNewArrivals() {
    return (
        <Link href="/novedades" className="group flex flex-col justify-center p-8 bg-primary min-h-[120px] transition-opacity hover:opacity-95">
            <div className="space-y-4">
                <div className="text-4xl md:text-5xl font-bold text-white">Recién llegado</div>

                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-action-cta uppercase tracking-wider group-hover:gap-4 transition-all">
                    Ver novedades <ArrowRight size={16} />
                </div>
            </div>
        </Link>
    );
}