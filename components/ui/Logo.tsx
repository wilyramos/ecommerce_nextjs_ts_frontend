// File: frontend/components/ui/Logo.tsx
import Image from "next/image";

type LogoProps = {
    color?: "black" | "white";
    size?: number;
};

export default function Logo({ color = "black", size = 24 }: LogoProps) {
    const logoSrc = color === "black" ? "/logogophone.png" : "/logow.svg";
    const logoHeight = size;
    // Mantenemos la proporción asumiendo una relación de aspecto original de 120x40 (3:1)
    const logoWidth = (size / 40) * 120; 

    return (
        <div className="flex items-center shrink-0">
            <Image
                src={logoSrc}
                alt="GoPhone Logo"
                width={logoWidth}
                height={logoHeight}
                quality={90} // Aumentado para mejor nitidez en el header
                priority
                className="w-auto h-auto object-contain"
            />
        </div>
    );
}