import Image from "next/image";

export default function Logo() {

    return (
        <Image
            src="/logob.svg"
            alt="Logo"
            width={120}
            height={120}
            quality={100}
            className="h-10 w-auto"
        />
    );
}