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
        </div>
    );
}
