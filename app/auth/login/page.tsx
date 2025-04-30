import LoginForm from '@/components/auth/LoginForm'
import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

// SEO metadata for the page
export const metadata: Metadata = {
  title: 'Ecommerce - Iniciar Sesión',
  description: 'Ecommerce - Iniciar Sesión',
  keywords: 'iniciar sesión, ecommerce, cuenta',
}

export default function pageLogin() {
  return (
    <>
    
      <h1 className='text-4xl font-bold text-center text-slate-700 mt-10'>Iniciar Sesión</h1>
      <p className='text-center text-gray-400 pt-5'>Ingresa tus credenciales</p>
      
      <LoginForm />

      <nav className="text-center text-sm pt-5">
        <Link
          href="/auth/registro"
          className="text-gray-800"
        >
          ¿No tienes una cuenta? <span className="font-bold text-slate-500 hover:text-slate-700">Crea una</span>
        </Link>
      </nav>
    
    </>
  )
}
