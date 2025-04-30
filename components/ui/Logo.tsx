import Image from "next/image";

export default function Logo() {

    return (
        <Image
            src="/vercel.svg"
            alt="Logo"
            width={100}
            height={100}
            className="rounded-full bg-amber-400 p-2 mb-5"
        />
    );
}