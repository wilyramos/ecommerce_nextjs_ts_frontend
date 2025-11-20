import Image from "next/image";

export default function Logo() {

    return (
        <Image
            src="/logogophone.png"
            alt="Logo"
            width={140}
            height={140}
            quality={70}
            className="h-10 w-auto"
        />
    );
}