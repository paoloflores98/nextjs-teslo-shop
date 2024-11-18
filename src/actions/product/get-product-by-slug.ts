"use server"
import prisma from "@/lib/prisma"

export const getProductBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findFirst({ // Encontrar el primer producto
      include: { // Incluir todas las imágenes del producto
        ProductImage: {
          select: {
            url: true
          }
        }
      },
      where: {
        slug: slug,
      }
    })

    // Verificar si no existe el producto
    if (!product) return null

    return {
      ...product,
      images: product.ProductImage.map(image => image.url)
    }

  } catch {
    throw new Error("Error al obtener producto por slug")
  }
}