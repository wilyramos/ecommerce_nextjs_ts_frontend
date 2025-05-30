import type { Category } from "@/src/schemas"


export default function CategoryForm({ category, categories }: { category?: Category, categories: Category[] }) {

    return (
        <>

            <div className='space-y-3'>

                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre de la categoria</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={category?.nombre}
                    
                />
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción de la categoria</label>
                <textarea
                    id="description"
                    name="description"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={category?.descripcion}
                /> 
                
                
                <label htmlFor="parent" className="block text-sm font-medium text-gray-700">Categoria padre</label>
                <select
                    id="parent"
                    name="parent"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={category?.parent?._id || ""}
                >
                    <option value="">Seleccionar categoria padre</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat._id === category?._id ? `${cat.nombre} (actual)` : cat.nombre}
                            
                        </option>
                    ))}
                </select>
            </div>
        </>
    )
}
