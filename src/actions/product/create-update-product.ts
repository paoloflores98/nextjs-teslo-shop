"use server"
import prisma from "@/lib/prisma"
import { Gender, Product, Size } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { v2 as cloudinary } from "cloudinary"

// Cloudinary
cloudinary.config(process.env.CLOUDINARY_URL ?? '')

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform(val => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0)
    .transform(val => Number(val.toFixed(0))),
  categoryId: z.string().uuid(),
  sizes: z.coerce.string().transform(val => val.split(',')),
  tags: z.string(),
  gender: z.nativeEnum(Gender),
})

export const createUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData)
  const productParsed = productSchema.safeParse(data) // Validar esquema de Zod

  if (!productParsed.success) {
    return { ok: false }
  }

  const product = productParsed.data
  product.slug = product.slug.toLowerCase().replace(/ /g, '-').trim() // Asegurar que el slug no tenga espacios

  const { id, ...rest } = product

  try {
    const prismaTx = await prisma.$transaction(async () => {
      let product: Product
      const tagsArray = rest.tags.split(',').map(tag => tag.trim().toLowerCase())

      if (id) {
        // Actualizar el producto
        product = await prisma.product.update({
          where: { id },
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[],
            },
            tags: {
              set: tagsArray
            }
          }
        })

      } else {
        // Crear el producto
        product = await prisma.product.create({
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[],
            },
            tags: {
              set: tagsArray
            }
          }
        })
      }

      // Proceso de carga y guardado de imágenes
      // Recorrer las imágenes y guardarlas
      if (formData.getAll('images')) {
        const images = await uploadImages(formData.getAll('images') as File[]) // [https://url.jpg, https://url.jpg]
        
        if (!images) {
          throw new Error('No se pudo cargar las imágenes, rollingback')
        }
        
        // Subir las imágenes a la DB
        await prisma.productImage.createMany({
          data: images.map(image => ({
            url: image!,
            productId: product.id,
          }))
        })
      }

      return {
        product
      }
    })

    // Revalidar los paths
    revalidatePath('/admin/products')
    revalidatePath(`/admin/product/${product.slug}`)
    revalidatePath(`/products/${product.slug}`)

    return {
      ok: true,
      product: prismaTx.product,
    }
  } catch {
    return {
      ok: false,
      message: 'Revisar los logs, no se pudo actualizar/crear'
    }
  }
}

// Cloudinary
export const uploadImages = async (images: File[]) => {
  
  try {
    const uploadPromises = images.map(async (image) => {
      try {
        const buffer = await image.arrayBuffer()
        const base64Image = Buffer.from(buffer).toString('base64') // Crear la imagen a base54

        return cloudinary.uploader.upload("data:image/png;base64," + base64Image).then(r => r.secure_url)
      } catch (error) {
        console.log('uploadImages', error)

        return null
      }
    })

    const uploadedImages = await Promise.all(uploadPromises)

    return uploadedImages
  } catch (error) {
    console.log(error)

    return null
  }
}