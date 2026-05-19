"use client";

import { useRouter } from "next/navigation";
import CollectionModal from "./collection-modal";
import { Collection } from "@/src/schemas/collection.schema";

interface Props {
    isOpen: boolean;
    collectionToEdit: Collection | null;
}

export default function CollectionModalWrapper({ isOpen, collectionToEdit }: Props) {
    const router = useRouter();

    return (
        <CollectionModal
            isOpen={isOpen}
            onClose={() => router.push("/admin/collections")}
            collectionToEdit={collectionToEdit}
        />
    );
}