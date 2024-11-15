"use server"
import prisma from "@/lib/prisma"

export const getStockBySlug = async(slug: string): Promise<number> => {

  try {
    const stock = await prisma.product.findFirst({ // Encontrar el primer producto en stock
      where: { slug },
      select: { inStock: true }
    })

    return stock?.inStock ?? 0 // Verificar si el producto está en stock

  } catch (error) {
    return 0
  }
}