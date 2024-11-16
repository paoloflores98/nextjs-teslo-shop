import type { CartProduct } from "@/interfaces"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface State {
  cart: CartProduct[]

  getTotalItems: () => number
  getSummaryInformation: () => {
    subTotal: number
    tax: number
    total: number
    itemsInCart: number
  }

  addProductToCart: (product: CartProduct) => void
  updateProductQuantity: (product: CartProduct, quantity: number) => void
  removeProduct: (product: CartProduct) => void
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],

      /* Métodos */
      // Método 1 - Obtener la cantidad total de productos
      getTotalItems: () => get().cart.reduce((total, item) => total + item.quantity, 0),
      
      // Método 2 - Obtener el detalle de la orden
      getSummaryInformation: () => {
        const { cart } = get()

        const subTotal = cart.reduce(
          (subTotal, product) => product.quantity * product.price + subTotal, 0
        )
        const tax = subTotal * 0.15
        const total = subTotal + tax
        const itemsInCart = cart.reduce(
          (total, item) => total + item.quantity, 0
        )

        return {
          subTotal,
          tax,
          total,
          itemsInCart,
        }
      },

      // Método 3 - Agregar un producto al carrito
      addProductToCart: (product: CartProduct) => {
        const { cart } = get()

        // 1. Revisar si el producto existe en el carrito con la talla seleccionada
        const productInCart = cart.some(
          (item) => item.id === product.id && item.size === product.size
        )

        if (!productInCart) {
          set({ cart: [...cart, product] }) // Actualizar el carrito
          return
        }

        // 2. Incrementar la cantidad del producto si existe por talla
        const updatedCartProducts = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return {
              ...item,
              quantity: item.quantity + product.quantity
            }
          }

          return item
        })

        set({ cart: updatedCartProducts }) // Actualizar el carrito
      },

      // Método 4 - Actualizar el carrito
      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get()

        const updatedCartProducts = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return {
              ...item,
              quantity: quantity
            }
          }

          return item
        })

        set({ cart: updatedCartProducts })
      },

      // Método 5 - Eliminar el producto del carrito
      removeProduct: (product: CartProduct) => {
        const { cart } = get()
        const updatedCartProducts = cart.filter(
          (item) => item.id !== product.id || item.size !== product.size // Filtrar los productos donde el ID o talla del producto seleccionado es diferente
        )

        set({ cart: updatedCartProducts })
      },
    }),
    {
      name: "shopping-cart",
    }
  )
)