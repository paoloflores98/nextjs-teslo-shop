export const revalidate = 0

// https://tailwindcomponents.com/component/hoverable-table
import { getPaginatedProductsWithImages } from "@/actions"
import { Pagination, ProductImage, Title } from "@/components"
import { currencyFormat } from "@/utils"
import Link from "next/link"

interface Props {
  searchParams: {
    page?: string
  }
}

export default async function OrdersPage({ searchParams }: Props) {
  // Verificar si el parámetro URL 'page' existe
  const page = searchParams.page ? parseInt(searchParams.page) : 1

  const { products, totalPages } = await getPaginatedProductsWithImages({ page })

  return (
    <>
      <Title title="Mantenimiento de productos" /> {/* Renderiza el componente */}

      <div className="flex justify-end mb-5">
        <Link
          className="btn-primary"
          href="/admin/product/new"
        >Nuevo producto</Link>
      </div>

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Imagen</th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Título</th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Precio</th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Género</th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Stock</th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Tallas</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100" key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <Link href={`/product/${product.slug}`}>
                    <ProductImage
                      className="w-20 h-20 object-cover rounded"
                      src={product.ProductImage[0]?.url}
                      width={80}
                      height={80}
                      alt={product.title}
                    />
                  </Link>
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <Link
                    className="hover:underline"
                    href={`/admin/product/${product.slug}`}
                  >
                    {product.title}
                  </Link>
                </td>
                <td className="text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap">{currencyFormat(product.price)}</td>
                <td className="text-sm font-light text-gray-900 px-6 py-4 whitespace-nowrap">{product.gender}</td>
                <td className="text-sm font-light text-gray-900 px-6 py-4 whitespace-nowrap">{product.inStock}</td>
                <td className="text-sm font-light text-gray-900 px-6 py-4 whitespace-nowrap">{product.sizes.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination totalPages={totalPages} /> {/* Renderiza el componente */}
      </div>
    </>
  )
}