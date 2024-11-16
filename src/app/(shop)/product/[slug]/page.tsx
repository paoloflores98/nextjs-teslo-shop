export const revalidate = 604800 // 7 días
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { titleFont } from "@/config/fonts"
import { ProductMobileSlideshow, ProductSlideshow, StockLabel } from "@/components"
import { getProductBySlug } from "@/actions"
import { AddToCart } from "./ui/AddToCart"

interface Props {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Leer parámetros de ruta 
  const { slug } = params

  // Obtener datos
  const product = await getProductBySlug(slug)

  return {
    title: product?.title ?? 'Producto no encontrado',
    description: product?.description ?? '',
    openGraph: {
      title: product?.title ?? 'Producto no encontrado',
      description: product?.description ?? '',
      images: [`/products/${product?.images[1]}`], // https://misitioweb.com/products/prod-1/image.jpg
    },
  }
}

export default async function ProductSlugPage({ params }: Props) {
  const { slug } = params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* Slideshow */}
      <div className="col-span-1 md:col-span-2">
        {/* Mobile Slideshow */}
        <ProductMobileSlideshow // Renderiza el componente
          className="block md:hidden"
          title={product.title}
          images={product.images}
        />

        {/* Desktop Slideshow */}
        <ProductSlideshow // Renderiza el componente
          className="hidden md:block"
          title={product.title}
          images={product.images}
        />
      </div>

      {/* Detalles */}
      <div className="col-span-1 px-5">
        <StockLabel slug={product.slug} /> {/* Renderiza el componente */}

        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>{product.title}</h1>
        <p className="text-lg mb-5">${product.price}</p>

        <AddToCart product={product} />

        {/* Descripción */}
        <h3 className="font-bold text-sm">Descripción</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  )
}