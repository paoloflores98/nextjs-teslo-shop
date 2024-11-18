"use client"
import { useCartStore } from "@/store"
import { currencyFormat } from "@/utils"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const OrderSummary = () => {
  const router = useRouter()

  const [loaded, setLoaded] = useState(false)
  const { getSummaryInformation } = useCartStore() // Zustand
  const { itemsInCart, subTotal, tax, total } = getSummaryInformation()
  
  useEffect(() => {
    setLoaded(true)
  }, [])

  // Redirigir a la página empty si el carrito está vacío
  useEffect(() => {
    if (itemsInCart === 0 && loaded === true) {
      router.replace('/empty')
    }
  }, [itemsInCart, loaded, router]) // Incluir router como dependencia

  if (!loaded) return <p>Cargando...</p>

  return (
    <div className="grid grid-cols-2">
      <span>N° de productos</span>
      <span className="text-right">
        {itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}
      </span>

      <span>Subtotal</span>
      <span className="text-right">{currencyFormat(subTotal)}</span>

      <span>Impuestos (15%)</span>
      <span className="text-right">{currencyFormat(tax)}</span>

      <span className="mt-5 text-2xl">Total:</span>
      <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
    </div>
  )
}