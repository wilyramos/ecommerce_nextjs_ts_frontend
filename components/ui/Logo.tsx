import Image from "next/image";

type LogoProps = {
    color?: "black" | "white";
};

export default function Logo({ color = "black" }: LogoProps) {
    const logoSrc = color === "black" ? "/logogophone.png" : "/logow.svg";

    return (
        <div className="flex items-center gap-0 md:gap-1">
            <Image
                src={logoSrc}
                alt="Logo"
                width={120}
                height={40}
                quality={10}
                priority
                className="w-auto"
            />
        </div>
    );
}
