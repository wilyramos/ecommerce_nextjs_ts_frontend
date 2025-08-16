import { TbTruckDelivery } from "react-icons/tb";

export default function Advertisement() {
    return (
        <section className="bg-yellow-300 text-blue-900 py-2 px-4 shadow-sm">
            <div className="flex items-center justify-center gap-2 text-sm md:text-base font-medium">
                <TbTruckDelivery className="text-blue-800 text-lg" aria-hidden="true" />
                <span>
                    Envíos en <span className="font-semibold">Cañete</span> por tiempo limitado
                </span>
                <span className="hidden sm:inline bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    GRATIS
                </span>
            </div>
        </section>
    );
}
