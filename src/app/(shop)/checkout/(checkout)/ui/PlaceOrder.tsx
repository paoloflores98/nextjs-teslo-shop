"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import clsx from "clsx"
import { placeOrder } from "@/actions"
import { useAddressStore, useCartStore } from "@/store"
import { currencyFormat } from "@/utils"

export const PlaceOrder = () => {
  const router = useRouter()

  const [loaded, setLoaded] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  /* Zustand */
  const address = useAddressStore((state) => state.address)
  const cart = useCartStore(state => state.cart)
  const clearCart = useCartStore(state => state.clearCart)
  const { getSummaryInformation } = useCartStore()

  const { itemsInCart, subTotal, tax, total } = getSummaryInformation()

  useEffect(() => {
    setLoaded(true)
  }, [])

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true)
    setIsPlacingOrder(false)

    // Recorrer los productos de la orden
    const productsToOrder = cart.map(product => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }))

    /* Server Action */
    const response = await placeOrder(productsToOrder, address)

    // Verificar si la respuesta no pasa
    if (!response.ok) {
      setIsPlacingOrder(false)
      // setErrorMessage(response.message) // Se comentó debido al catch de place-order.ts
      setErrorMessage(response.message || 'Hubo un error al colocar la orden') // Agregar valor por defecto si no existe message
      
      return
    }

    clearCart() // Limpiar el carrito
    router.replace('/orders/' + response.order?.id)
  }

  // Verificar si la carga no está lista
  if (!loaded) return <p>Cargando...</p>

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl font-bold mb-2">Dirección de entrega</h2>
      <div className="mb-10">
        <p className="text-xl">{address.firstName} {address.lastName}</p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>{address.city}, {address.country}</p>
        <p>{address.phone}</p>
      </div>

      {/* Divisor */}
      <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

      <h2 className="text-2xl mb-2">Resumen de la orden</h2>
      <div className="grid grid-cols-2">
        <span>N° de productos</span>
        <span className="text-right">{itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}</span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
      </div>

      <div className="mt-5 mb-2 w-full">
        {/* Disclaimer */}
        <p className="mb-5">
          <span className="text-xs">
            Al hacer clic en &quot;Colocar orden&quot;, aceptas nuestros <a className="underline" href="#">Términos y condiciones</a> y <a className="underline" href="#">Políticas de privacidad</a>
          </span>
        </p>

        <p className="text-red-500">{errorMessage}</p>

        <button
          className={clsx({
            'btn-primary': !isPlacingOrder,
            'btn-disabled': isPlacingOrder
          })}
          onClick={onPlaceOrder}
        >Colocar orden</button>
      </div>
    </div>
  )
}