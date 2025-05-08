import React from 'react'

export default function CategoryForm() {
    return (
        <>
        
            <div className='space-y-3'>

                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre de la categoria</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    // defaultValue={}
                    
                />
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción de la categoria</label>
                <input
                    type="text"
                    id="description"
                    name="description"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    // defaultValue={}
                    
                />

                
            </div>
        </>
    )
}
