export const revalidate = 60 // false | 0 | number. 60 segundos
import { redirect } from "next/navigation"
import { getPaginatedProductsWithImages } from "@/actions"
import { Pagination, ProductGrid, Title } from "@/components"

interface Props {
  searchParams: {
    page?: string 
  }
}

export default async function Home({searchParams}: Props) {
  // Verificar si el parámetro URL 'page' existe
  const page = searchParams.page ? parseInt(searchParams.page ) : 1

  const { products, totalPages} = await getPaginatedProductsWithImages({ page })

  // Verificar si no tenemos productos paginados
  if(products.length === 0) {
    redirect('/')
  }

  return (
    <>
      <Title // Renderiza el componente
        className="mb-2"
        title="Tienda"
        subtitle="Todos los productos"
      />

      <ProductGrid // Renderiza el componente
        products={products}
      />

      <Pagination // Renderiza el componente
        totalPages={totalPages}
      />
    </>
  )
}