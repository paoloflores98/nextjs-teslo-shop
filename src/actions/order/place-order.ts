"use server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth.config"
import type { Address, Size } from "@/interfaces"

interface ProductToOrder {
  productId: string
  quantity: number
  size: Size
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {
  const session = await auth()
  const userId = session?.user.id

  // Verificar si no hay sesión de usuario activa
  if (!userId) {
    return {
      ok: false,
      message: "No hay sesión de usuario",
    }
  }

  // Obtener la información de los productos. Nota: Podemos llevar 2+ productos con el mismo ID
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map((p) => p.productId),
      },
    },
  })

  // Calcular los montos. Encabezado
  const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0)

  // Calcular los totales de tax, subtotal y total
  const { subTotal, tax, total } = productIds.reduce(
    (totals, item) => {
      const productQuantity = item.quantity
      const product = products.find((product) => product.id === item.productId) // Buscar los productos que sean iguales a nuestro carrito

      if (!product) throw new Error(`${item.productId} no existe - 500`) // Verificar si el producto no existe

      const subTotal = product.price * productQuantity

      totals.subTotal += subTotal
      totals.tax += subTotal * 0.15
      totals.total += subTotal * 1.15

      return totals
    },
    { subTotal: 0, tax: 0, total: 0 }
  )

  // Crear la transacción de base de datos
  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el stock de los productos
      const updatedProductsPromises = products.map((product) => {
        //  Acumular los valores
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => item.quantity + acc, 0)
        
        // Verificar si la cantidad es igual a cero
        if (productQuantity === 0) throw new Error(`${product.id} no tiene cantidad definida`)
        
        return tx.product.update({
          where: { id: product.id },
          data: {
            // inStock: product.inStock - productQuantity // Así no se debe hacer
            inStock: {
              decrement: productQuantity,
            },
          },
        })
      })

      const updatedProducts = await Promise.all(updatedProductsPromises)

      // Verificar si hay valores negativos en las existencias
      updatedProducts.forEach((product) => {
        if (product.inStock < 0) throw new Error(`${product.title} no tiene inventario suficiente`)
      })

      // 2. Crear la orden - Encabezado - Detalles
      const order = await tx.order.create({
        data: {
          userId: userId,
          itemsInOrder: itemsInOrder,
          subTotal: subTotal,
          tax: tax,
          total: total,

          OrderItem: {
            createMany: {
              data: productIds.map((p) => ({
                quantity: p.quantity,
                size: p.size,
                productId: p.productId,
                price: products.find((product) => product.id === p.productId)?.price ?? 0,
              })),
            },
          },
        },
      })

      // Retornar un error si el price es cero

      // 3. Crear la direccion de la orden
      const { country, ...restAddress } = address
      const orderAddress = await tx.orderAddress.create({
        data: {
          // ...restAddress,
          // countryId: country,
          // orderId: order.id,
          firstName: restAddress.firstName,
          lastName: restAddress.lastName,
          address: restAddress.address,
          address2: restAddress.address2,
          postalCode: restAddress.postalCode,
          city: restAddress.city,
          phone: restAddress.phone,
          countryId: country,
          orderId: order.id,
        },
      })

      return {
        updatedOrder: updatedProducts,
        order: order,
        orderAddress: orderAddress,
      }
    })

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx: prismaTx,
    }

  // } catch (error: any) {
  //   return {
  //     ok: false,
  //     message: error?.message,
  //   }
  // }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        ok: false,
        message: error.message,
      }
    }

    // En caso de que el error no sea una instancia de Error
    return {
      ok: false,
      message: 'Error desconocido',
    }
  }
}