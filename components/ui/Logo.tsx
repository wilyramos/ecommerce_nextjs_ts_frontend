import Image from "next/image";

type LogoProps = {
    color?: "black" | "white";
};

export default function Logo({ color = "black" }: LogoProps) {
    const logoSrc = color === "black" ? "/logogophone.png" : "/logow.svg";

    return (
        <div className="abolute flex items-center gap-0 md:gap-1">
            {/* Logo */}
            <Image
                src={logoSrc}
                alt="Logo"
                width={40}
                height={40}
                quality={10}
                className="w-auto "
            />

            {/* Gorrito navideño */}
            <Image
                src="/hat.png" // gorrito moderno en SVG o PNG con fondo transparente
                alt=""
                width={26}
                height={26}
                className="relative -top-2 -left-1 md:-top-2 md:-left-2 w-auto rotate-45"
            />
        </div>
    );
}
