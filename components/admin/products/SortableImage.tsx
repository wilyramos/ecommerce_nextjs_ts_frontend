"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import Image from "next/image";
import DeleteImageButton from "./DeleteImageButton";

interface Props {
    id: string;
    src: string;
    onDelete: () => void;
}

export default function SortableImage({ id, src, onDelete }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="relative w-full h-32 rounded-lg overflow-hidden border cursor-grab active:cursor-grabbing"
        >
            <Image src={src} alt="" fill className="object-cover" />

            <div
                className="absolute top-1 right-1 z-10"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
            >
                <DeleteImageButton image={src} setImagenes={() => {}} />
            </div>
        </div>
    );
}
