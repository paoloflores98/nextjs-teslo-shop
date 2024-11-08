import { ProductGrid, Title } from "@/components"
import { Category } from "@/interfaces"
import { initialData } from "@/seed/seed"

const seedProducts = initialData.products

interface Props {
 params: {
  id: Category
 }
}

export default function CategoryIdPage({params}: Props) {
  const { id } = params
  const products = seedProducts.filter(product => product.gender === id)

  // El tipado es opcional. Se utiliza la utilidad Record de TS
  // El tipado Record<Category, string> es igual a {[key: string]: string}
  const labels: Record<Category, string>= {
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
      title={`Artículos ${labels[id]}`}
      subtitle='Todos los productos'
      />

      <ProductGrid // Renderiza el componente
        products={products}
      />
    </>
  )
}