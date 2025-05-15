import React from 'react'

export default function Footer() {
  return (
    <>
    
        <footer className="bg-gray-800 text-white py-4 h-screen">
            <div className="container mx-auto text-center">

                <p className="text-sm">© 2023 Tu Tienda. Todos los derechos reservados.</p>
                <div className="flex justify-center space-x-4 mt-2">
                    <a href="#" className="text-gray-400 hover:text-gray-300">Política de Privacidad</a>
                    <a href="#" className="text-gray-400 hover:text-gray-300">Términos de Servicio</a>
                    <a href="#" className="text-gray-400 hover:text-gray-300">Contacto</a>
                </div>
            
            </div>
        </footer>
    
    </>
  )
}
