import Image from "next/image";

type LogoProps = {
    color?: "black" | "white";
};

export default function Logo({ color = "black" }: LogoProps) {
    const src = color === "black" ? "/logogophone.png" : "/logow.svg";

    return (
        <Image
            src={src}
            alt="Logo"
            width={40}
            height={40}
            quality={10}
            className="w-auto"
        />
    );
}
