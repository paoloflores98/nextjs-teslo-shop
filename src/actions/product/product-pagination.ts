"use server"
import prisma from "@/lib/prisma"
import { Gender } from "@prisma/client"

interface PaginationOptions {
  page?: number
  take?: number
  gender?: Gender
}

export const getPaginatedProductsWithImages = async ({page = 1, take = 12, gender}: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1 // Verificar si el parámetro URL 'page' no existe
  if (page < 1) page = 1 // Verificar si la página es menor a uno

  try {
    // Obtener los productos
    const products = await prisma.product.findMany({
      take: take, // LIMIT
      skip: (page - 1) * take, // Cantidad de productos por página
      include: {
        ProductImage: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
      where: { // Filtrar por género
        gender: gender,
      },
    })

    // Obtener el total de páginas
    const totalCount = await prisma.product.count({
      where: {
        gender: gender,
      },
    })
    
    const totalPages = Math.ceil(totalCount / take)

    return {
      currentPage: page,
      totalPages: totalPages,
      products: products.map((product) => ({
        ...product,
        images: product.ProductImage.map((image) => image.url),
      })),
    }
  }catch {
    throw new Error("No se pudo cargar los productos")
  }
}