"use client"

import { TrashIcon } from "@heroicons/react/24/outline"

interface DeleteImageButtonProps {
    image: string
    setImagenes: React.Dispatch<React.SetStateAction<string[]>>
}

export default function DeleteImageButton({ image, setImagenes }: DeleteImageButtonProps) {
    const handleDelete = () => {
        setImagenes((prev) => prev.filter((img) => img !== image))
    }

    return (
        <button
            onClick={handleDelete}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-700 transition duration-200 cursor-pointer"
        >
            <TrashIcon className="h-5 w-5" />
        </button>
    )
}
