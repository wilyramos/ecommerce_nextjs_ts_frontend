import Footer from "@/components/home/Footer"
// import ProductList from './components/ProductList'
// import ProductCard from './components/ProductCard'
// import CategoryList from './components/CategoryList'
// import Footer from './components/Footer'

export default function HomePage() {
    return (
        <>
            

            {/* Hero principal */}
           

            <div className="bg-gray-100 py-10">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-center mb-6">Bienvenido a nuestra tienda</h1>
                    <p className="text-lg text-center mb-6">Encuentra los mejores productos al mejor precio</p>
                </div>
            </div>

            <section className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Productos Destacados</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Aquí puedes mapear tus productos */}
                    {/* <ProductList /> */}
                    {/* <ProductCard /> */}
                </div>
            </section>

            <Footer />
        </>
    )
}
