import { TbTruckDelivery } from "react-icons/tb";

export default function Advertisement() {
    return (
        <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white text-center text-sm md:text-base font-medium py-2 px-4 shadow z-50">
            <div className="inline-flex items-center justify-center gap-2">
                <TbTruckDelivery className="text-indigo-400 text-lg" aria-hidden="true" />
                <span>Envíos en Cañete por tiempo limitado</span>
                <span className="hidden sm:inline bg-indigo-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    GRATIS
                </span>
            </div>
        </section>
    );
}
