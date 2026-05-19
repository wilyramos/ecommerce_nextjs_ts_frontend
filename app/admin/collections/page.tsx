//File: frontend/app/admin/collections/page.tsx

import { collectionService } from "@/src/services/collection-service";
import DeleteCollectionButton from "@/components/admin/collections/delete-button";
import CollectionModal from "@/components/admin/collections/collection-modal";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
    searchParams: Promise<{ modal?: string; editId?: string }>;
}

export default async function AdminCollectionsPage({ searchParams }: Props) {
    const { modal, editId } = await searchParams;

    // Obtener todas las colecciones desde el servicio
    const collections = await collectionService.getAll();

    // Filtrar en memoria la colección a editar para reutilizar el método getAll existente
    const collectionToEdit = editId
        ? collections.find((c) => c._id === editId) || null
        : null;

    const isModalOpen = modal === "new" || !!editId;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Colecciones Temáticas</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Gestiona secciones horizontales y estilos del catálogo (Ej: Spiderman, Navidad, Hello Kitty).
                    </p>
                </div>
                <Link
                    href="/admin/collections?modal=new"
                    className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    + Nueva Colección
                </Link>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="p-4 font-semibold text-sm text-gray-600">Nombre</th>
                            <th className="p-4 font-semibold text-sm text-gray-600">Slug</th>
                            <th className="p-4 font-semibold text-sm text-gray-600">Prioridad</th>
                            <th className="p-4 font-semibold text-sm text-gray-600">Estado</th>
                            <th className="p-4 font-semibold text-sm text-gray-600 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {collections.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-sm text-gray-400">
                                    No hay colecciones creadas actualmente.
                                </td>
                            </tr>
                        ) : (
                            collections.map((col) => (
                                <tr key={col._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900 flex items-center gap-3">
                                        {col.color && (
                                            <span
                                                className="w-3 h-3 rounded-full border border-gray-300 inline-block"
                                                style={{ backgroundColor: col.color }}
                                            />
                                        )}
                                        {/* {col.nombre} */}
                                    </td>
                                    <td className="p-4 text-gray-500 text-sm">{col.slug}</td>
                                    <td className="p-4 text-sm text-gray-700">{col.order}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${col.isActive
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                            }`}>
                                            {col.isActive ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-4 text-sm">
                                        <Link
                                            href={`/admin/collections/${col._id}/products`}
                                            className="text-blue-600 hover:text-blue-900 font-medium"
                                        >
                                            Asignar Productos
                                        </Link>
                                        <Link
                                            href={`/admin/collections?editId=${col._id}`}
                                            className="text-gray-600 hover:text-gray-900 font-medium"
                                        >
                                            Editar
                                        </Link>
                                        {col.isActive && (
                                            <DeleteCollectionButton id={col._id} slug={col.slug} />
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <CollectionModal
                    isOpen={isModalOpen}
                    collectionToEdit={collectionToEdit}
                />
            )}
        </div>
    );
}