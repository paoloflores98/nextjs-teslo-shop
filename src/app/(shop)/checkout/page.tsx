import Link from "next/link"
import Image from "next/image"
import { Title } from "@/components"
import { initialData } from "@/seed/seed"

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
]

export default function() {
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title="Verificar orden" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <span className="text-xl">Ajustar elementos</span>
            <Link
              className="underline mb-5"
              href="/cart"
            >Editar carrito</Link>

            {/* Items */}
            {productsInCart.map(product => (
              <div className="flex mb-5" key={product.slug}>
                <Image
                  className="mr-5 rounded"
                  src={`/products/${product.images[0]}`}
                  width={100}
                  height={100}
                  style={{
                    width: '100px',
                    height: '100px',
                  }}
                  alt={product.title}
                />

                <div className="">
                  <p>{product.title}</p>
                  <p>${product.price} x 3</p>
                  <p className="font-bold">Subtotal: ${product.price * 3}</p>

                  <button
                    className="underline mt-3"
                  >Remover</button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout */}
          <div>
            <div className="bg-white rounded-xl shadow-xl p-7">
              <h2 className="text-2xl font-bold mb-2">Dirección de entrega</h2>
              <div className="mb-10">
                <p>Fernando Herrera</p>
                <p>Circunvalación Cumbaza #635</p>
                <p>Tarapoto, San Martin</p>
                <p>22202</p>
              </div>

              {/* Divisor */}
              <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

              <h2 className="text-2xl mb-2">Resumen de la orden</h2>
              <div className="grid grid-cols-2">
                <span>No. de producto</span>
                <span className="text-right">3 artículos</span>

                <span>Subtotal</span>
                <span className="text-right">$100</span>

                <span>Impuestos (15%)</span>
                <span className="text-right">$100</span>

                <span className="text-2xl mt-5">Total</span>
                <span className="text-2xl mt-5 text-right">$100</span>
              </div>

              <div className="mt-5 mb-2 w-full">
                {/* Disclaimer */}
                <p className="mb-5">
                  <span className="text-xs">
                    Al hacer clic en "Colocar orden", aceptas nuestros <a className="underline" href="#">Términos y condiciones</a> y <a className="underline" href="#">Políticas de privacidad</a>
                  </span>
                </p>

                <Link
                  className="flex btn-primary justify-center"
                  href="/orders/123"
                >Colocar orden</Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}