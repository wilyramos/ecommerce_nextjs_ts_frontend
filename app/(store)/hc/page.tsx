'use client';

import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function PageCentroAyuda() {
    const [searchQuery, setSearchQuery] = useState('');

    const faqs = [
        { question: "¿Cómo puedo hacer un pedido?", answer: "Selecciona los productos que deseas, agrégalos al carrito y sigue el proceso de pago." },
        { question: "¿Cuánto tarda el envío?", answer: "El envío estándar tarda entre 3-7 días hábiles." },
        { question: "¿Puedo devolver un producto?", answer: "Sí, dentro de los 30 días posteriores a la entrega." },
    ];

    const filteredFaqs = faqs.filter(faq => faq.question.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <section className="max-w-6xl mx-auto px-4 py-10 space-y-8">
            <h1 className="text-3xl font-bold text-center">Centro de Ayuda</h1>

            {/* Buscador */}
            <div className="flex justify-center mb-8">
                <div className="relative w-full max-w-xl">
                    <input
                        type="text"
                        placeholder="Buscar ayuda..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border rounded-lg py-2 pl-10 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute top-2.5 left-3 text-gray-400" />
                </div>
            </div>

            {/* Preguntas frecuentes */}
            <div className="space-y-4">
                {filteredFaqs.length ? (
                    filteredFaqs.map((faq, idx) => (
                        <details key={idx} className="border rounded-lg p-4 bg-white shadow-sm">
                            <summary className="font-medium cursor-pointer">{faq.question}</summary>
                            <p className="mt-2 text-gray-700">{faq.answer}</p>
                        </details>
                    ))
                ) : (
                    <p className="text-gray-500">No se encontraron resultados.</p>
                )}
            </div>
        </section>
    );
}
