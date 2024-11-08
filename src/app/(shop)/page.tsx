import { ProductGrid, Title } from "@/components"
import { initialData } from "@/seed/seed"

// Seed temporal
const products = initialData.products

export default function Home() {
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
    </>
  )
}