import Image from "next/image";

export default function Logo() {

    return (
        <Image
            src="/logob.svg"
            alt="Logo"
            width={120}
            height={120}
            quality={100}
            className="hover:scale-105 transition-transform duration-300"
        />
    );
}