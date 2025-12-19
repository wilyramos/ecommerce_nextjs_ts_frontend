import Image from "next/image";

type LogoProps = {
    color?: "black" | "white";
};

export default function Logo({ color = "black" }: LogoProps) {
    const logoSrc = color === "black" ? "/logogophone.png" : "/logow.svg";

    return (
        <div className="relative inline-block">
            {/* Logo */}
            <Image
                src={logoSrc}
                alt="Logo"
                width={40}
                height={40}
                quality={10}
                className="w-auto"
            />

            {/* Gorrito navideño */}
            <Image
                src="/hat.png" // gorrito moderno en SVG o PNG con fondo transparente
                alt=""
                width={36}
                height={36}
                className="
          pointer-events-none
          absolute
          -top-1 md:-top-3
          -right-5
          rotate-14
          drop-shadow-sm
        "
            />
        </div>
    );
}
