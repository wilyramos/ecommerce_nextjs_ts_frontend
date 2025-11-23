import Image from "next/image";

export default function Logo() {

    return (
        <Image
            src="/logogophone.png"
            alt="Logo"
            width={80}
            height={40}
            quality={40}
            className="h-10 w-auto"
        />
    );
}