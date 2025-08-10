import { GetProductsBySlug } from '@/src/services/products';
import ProductPageServer from '@/components/home/product/ProductPageServer';
import { Suspense } from 'react';
import SpinnerLoading from '@/components/ui/SpinnerLoading';

type Params = Promise<{
    slug: string;
}>;

export async function generateMetadata({ params }: { params: Params }) {

    const { slug } = await params;
    const product = await GetProductsBySlug(slug);

    if (!product) {
        return {
            title: 'Producto no encontrado - GoPhone',
            description: 'El producto que buscas no está disponible.',
        };
    }

    const title = `${product.nombre} - GoPhone`;
    const description = product.descripcion?.replace(/\r?\n|\r/g, ' ').trim() || 'No description available';
    const categoryName = product.categoria?.nombre || 'General';
    const image = product.imagenes?.[0] || 'https://www.gophone.pe/logob.svg';

    return {
        title,
        description,
        keywords: [
            title,
            product.nombre,
            categoryName,
            'GoPhone',
            'Cañete',
            'Productos',
            'Tienda Online',
            'San vicente de Cañete',
            'Perú',
            'iphone',
            'Celulares',
            'Accesorios',
            'Tecnología',
            'Smartphones',  
        ],
        openGraph: {
            title,
            description,
            url: `https://www.gophone.pe/productos/${slug}`,
            siteName: 'GoPhone Cañete',
            type: 'website',
            images: [
                {
                    url: image,
                    alt: product.nombre,
                },
            ],
            price: product.precio,
            currency: 'PEN',
            category: categoryName,
            image: {
                url: image,
                alt: product.nombre,
            }

        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        icons: {
            icon: "/logomini.svg",
            apple: "/logomini.svg",
        }
    }
}

export default async function pageProduct({ params }: { params: Params }) {
    const { slug } = await params;


    return (
        <main className="px-4">            
            <Suspense fallback={<SpinnerLoading />}>
                <ProductPageServer
                    slug={slug}
                />
            </Suspense>
        </main>
    );
}
