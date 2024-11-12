export const revalidate = 60 // false | 0 | number. 60 segundos
import { getPaginatedProductsWithImages } from "@/actions"
import { Pagination, ProductGrid, Title } from "@/components"
import { Gender } from "@prisma/client"
import { redirect } from "next/navigation"

interface Props {
  params: {
    gender: string
  },
  searchParams: {
    page?: string
  }
}

export default async function CategoryIdPage({params, searchParams}: Props) {
  const { gender } = params

  // Verificar si el parámetro URL 'page' existe
  const page = searchParams.page ? parseInt(searchParams.page ) : 1

  const { products, totalPages} = await getPaginatedProductsWithImages({ page, gender: gender as Gender })

  // Verificar si no tenemos productos paginados
  if(products.length === 0) {
    redirect(`/gender/${gender}`)
  }

  // El tipado es opcional. Se utiliza la utilidad Record de TS
  // El tipado Record<string, string> es igual a {[key: string]: string}
  const labels: Record<string, string>= {
    'men': 'para Hombres',
    'women': 'para Mujeres',
    'kid': 'para Niños',
    'unisex': 'para todos'
  }

  // if(id === 'kids') {
  //   notFound()
  // }

  return (
    <>
      <Title // Renderiza el componente
      className="mb-2"
      title={`Artículos ${labels[gender]}`}
      subtitle='Todos los productos'
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