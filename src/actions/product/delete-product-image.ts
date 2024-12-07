"use server"
import prisma from "@/lib/prisma"
import { v2 as cloudinary } from "cloudinary"
import { revalidatePath } from "next/cache"

// Cloudinary
cloudinary.config(process.env.CLOUDINARY_URL ?? '')

export const deleteProductImage = async (imageId: number, imageUrl: string) => {
  // Verificar si el nombre de la imagen no empieza con 'http'
  if (!imageUrl.startsWith('http')) {
    return {
      ok: false,
      error: 'No se pueden borrar las imágenes de File System'
    }
  }

  const imageName = imageUrl // Ej: https://res.cloudinary.com/paoloflores/image/upload/v1733533741/quv3zpcxsxhqgcmx5f4n.avif
    .split('/')
    .pop()
    ?.split('.')[0] ?? ''

  try {
    await cloudinary.uploader.destroy(imageName)
    const deletedImage = await prisma.productImage.delete({
      where: {
        id: imageId
      },
      select: {
        product: {
          select: {
            slug: true
          }
        }
      }
    })

    // Revalidar los paths
    revalidatePath(`/admin/products`)
    revalidatePath(`/admin/product/${deletedImage.product.slug}`)
    revalidatePath(`/product/${deletedImage.product.slug}`)
  } catch (error) {
    console.log(error)

    return {
      ok: false,
      message: 'No se pudo eliminar la imagen'
    }
  }
}