'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '@/src/store/shippingStore';
import ErrorMessage from '../ui/ErrorMessage';

export default function IdentificacionForm() {
    const router = useRouter();
    const { profile, setProfile } = useCheckoutStore();

    const [form, setForm] = useState({
        email: '',
        name: '',
        lastname: '',
        documentType: 'DNI',
        document: '',
        phone: '',
    });

    // Llenar el formulario si hay datos en el profile
    useEffect(() => {
        if (profile) {
            const [firstName = '', lastName = ''] = profile.name?.split(' ') ?? [];
            setForm({
                email: profile.email || '',
                name: firstName,
                lastname: lastName,
                documentType: 'DNI', 
                document: profile.dni || '',
                phone: profile.phone || '',
            });
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProfile({
            name: `${form.name} ${form.lastname}`.trim(),
            email: form.email,
            dni: form.document,
            phone: form.phone,
        });
        router.push('/checkout/shipping');
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-5 pt-2">
            {/* Email */}
            <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-medium text-gray-700">Correo electrónico</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
            </div>

            {/* Nombre */}
            <div className="space-y-1">
                <label htmlFor="name" className="text-xs font-medium text-gray-700">Nombre</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
            </div>

            {/* Apellidos */}
            <div className="space-y-1">
                <label htmlFor="lastname" className="text-xs font-medium text-gray-700">Apellidos</label>
                <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    value={form.lastname}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
            </div>

            {/* Tipo + Número documento */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label htmlFor="documentType" className="text-xs font-medium text-gray-700">Tipo de documento</label>
                    <select
                        id="documentType"
                        name="documentType"
                        value={form.documentType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                    >
                        <option value="DNI">DNI</option>
                        <option value="CE">Carné de extranjería</option>
                        <option value="PAS">Pasaporte</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label htmlFor="document" className="text-xs font-medium text-gray-700">N° de documento</label>
                    <input
                        id="document"
                        name="document"
                        type="text"
                        value={form.document}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
            </div>

            {/* Teléfono */}
            <div className="space-y-1">
                <label htmlFor="phone" className="text-xs font-medium text-gray-700">Teléfono / Móvil</label>
                <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
            </div>

            {/* Botón */}
            <button
                type="submit"
                className="w-full py-3 text-white bg-gray-900 rounded-lg hover:bg-gray-800 font-medium transition-colors"
            >
                Continuar con el envío
            </button>
        </form>
    );
}
