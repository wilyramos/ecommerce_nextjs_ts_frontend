import NavBar from "@/components/navigation/NavBar"
// import ProductList from './components/ProductList'
// import ProductCard from './components/ProductCard'
// import CategoryList from './components/CategoryList'
// import Footer from './components/Footer'

export default function HomePage() {
    return (
        <>
            <NavBar />

            {/* Hero principal */}
            <section className="bg-white py-16">
                <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="max-w-xl">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Tecnología de vanguardia a un clic
                        </h1>
                        <p className="text-gray-600 text-lg mb-6">
                            Explora nuestra tienda y encuentra laptops, móviles, accesorios y más.
                        </p>
                        <a
                            href="#productos"
                            className="inline-block bg-amber-500 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-amber-600 transition"
                        >
                            Ver productos
                        </a>
                    </div>
                    <img
                        src="/images/hero-tech.png"
                        alt="Tecnología moderna"
                        className="w-full max-w-md"
                    />
                </div>
            </section>

            {/* Categorías destacadas */}
            {/* <CategoryList /> */}

            {/* Productos destacados */}
            <section id="productos" className="bg-gray-50 py-14">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Productos destacados</h2>
                    {/* <ProductList /> */}
                    {/* Puedes mapear ProductCard aquí */}
                </div>
            </section>

            {/* Beneficios / valores */}
            <section className="bg-white py-14 border-t border-gray-100">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Envío rápido</h3>
                        <p className="text-sm text-gray-600">Recibe tus productos en 24-48h.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Garantía de calidad</h3>
                        <p className="text-sm text-gray-600">Solo vendemos productos verificados.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Soporte especializado</h3>
                        <p className="text-sm text-gray-600">Atención técnica y asesoramiento.</p>
                    </div>
                </div>
            </section>

            {/* <Footer /> */}
        </>
    )
}
