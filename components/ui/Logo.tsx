import Image from "next/image";

type LogoProps = {
    color?: "black" | "white";
    size?: number;
};

export default function Logo({ color = "black", size = 24 }: LogoProps, ) {
    const logoSrc = color === "black" ? "/logogophone.png" : "/logow.svg";
    const logoHeight = size;
    const logoWidth = (size / 40) * 120; // Mantener la proporción original del logo

    return (
        <div className="flex items-center gap-0 md:gap-1">
            <Image
                src={logoSrc}
                alt="Logo"
                width={logoWidth}
                height={logoHeight}
                quality={10}
                priority
                className="w-auto"
            />
        </div>
    );
}
