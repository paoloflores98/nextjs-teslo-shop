"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useCartStore } from "@/store"
import { QuantitySelector } from "@/components"
import Link from "next/link"

export const ProductsInCart = () => {
  const [loaded, setLoaded] = useState(false)
  const { cart, updateProductQuantity, removeProduct } = useCartStore() // Zustand
  
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

          <div className="">
            <Link
              className="hover:underline cursor-pointer"
              href={`/product/${product.slug}`}
            >{product.title}</Link>
            <p>${product.price}</p>
            <QuantitySelector // Renderiza el componente
              quantity={product.quantity}
              onQuantityChanged={quantity => updateProductQuantity(product, quantity)}
            />

            <button
              className="underline mt-3"
              onClick={() => removeProduct(product)}
            >Remover</button>
          </div>
        </div>
      ))}
    </>
  )
}