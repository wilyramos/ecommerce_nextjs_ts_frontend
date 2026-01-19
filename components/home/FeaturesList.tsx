import Link from "next/link";
import type { IconType } from "react-icons";
import { FaTags, FaTruck, FaLock, FaExchangeAlt } from "react-icons/fa";

type Feature = {
  title: string;
  icon: IconType;
  url?: string;
};

const features: Feature[] = [
  { title: "Ofertas exclusivas", icon: FaTags },
  { title: "Envíos rápidos", icon: FaTruck },
  { title: "Pago 100% seguro", icon: FaLock },
  { title: "Cambios y devoluciones", icon: FaExchangeAlt, url: "/hc/garantias-y-devoluciones" },
];

export default function MinimalFeatures() {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 py-2">
        {features.map((feature) => {
          const Content = (
            <div
              className="group flex flex-col items-center justify-center text-center h-full p-5 rounded-2xl 
                         bg-[var(--store-surface)]  
                         text-[var(--store-text)] 
                         transition-all duration-300 hover:-translate-y-1 cursor-default"
              aria-label={feature.title}
            >
              <feature.icon
                size={22}
                className="mb-3 text-[var(--store-text-muted)] group-hover:text-[var(--store-text)] transition-colors"
              />
              <span className="text-xs md:text-sm font-medium tracking-wide">
                {feature.title}
              </span>
            </div>
          );

          return (
            <div key={feature.title} className="h-full">
              {feature.url ? (
                <Link href={feature.url} aria-label={feature.title} className="block h-full cursor-pointer">
                  {Content}
                </Link>
              ) : (
                Content
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}