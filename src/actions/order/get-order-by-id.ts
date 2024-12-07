"use server"
import { auth } from "@/auth.config"
import prisma from "@/lib/prisma"

export const getOrderById = async (id: string) => {
  const session = await auth()

  if (!session?.user) {
    return {
      ok: false,
      message: 'Debe de estar autenticado'
    }
  }
  
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            size: true,

            product: {
              select: {
                title: true,
                slug: true,

                ProductImage: {
                  select: {
                    url: true
                  },
                  take: 1
                }
              }
            }
          }
        }
      }
    })

    // Verificar si la orden no existe
    if (!order) throw `El ${id} no existe`

    // Verificar si el rol del usuario es 'user'
    if (session.user.role === 'user') {
      // Verificar si el ID del usuario es diferente a la orden del ID del usuario
      if (session.user.id !== order.userId) {
        throw `El ${id} no es de ese usuario`
      }
    }

    return {
      ok: true,
      order: order,
    }
  } catch (error) {
    console.log(error)

    return {
      ok: false,
      message: 'La orden no existe'
    }
  }
}