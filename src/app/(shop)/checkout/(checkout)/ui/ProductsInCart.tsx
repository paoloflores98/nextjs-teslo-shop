"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useCartStore } from "@/store"
import { currencyFormat } from "@/utils"

export const ProductsInCart = () => {
  const [loaded, setLoaded] = useState(false)
  const { cart } = useCartStore() // Zustand
  
  // Sincronizar los productos en el servidor
  useEffect(() => {
    setLoaded(true)
  }, [])

  if (!loaded) return <p>Cargando...</p>

  return (
    <>
      {cart.map(product => (
        <div className="flex mb-5" key={`${product.slug}-${product.size}`}>
          <Image
            className="mr-5 rounded"
            src={`/products/${product.image}`}
            width={100}
            height={100}
            style={{
              width: '100px',
              height: '100px',
            }}
            alt={product.title}
          />

          <div>
            <span>{product.title} - {product.size} ({product.quantity})</span>
            <p className="font-bold">{currencyFormat(product.price * product.quantity)}</p>
          </div>
        </div>
      ))}
    </>
  )
}