"use client"
import { createUpdateProduct, deleteProductImage } from "@/actions"
import { ProductImage } from "@/components"
import { Category, Product, ProductImage as ProductwithImage } from "@/interfaces"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

interface Props {
  product: Partial<Product> & { ProductImage?: ProductwithImage[] }
  categories: Category[]
}

interface FormInputs {
  title: string
  slug: string
  description: string
  price: number
  inStock: number
  sizes: string[]
  tags: string
  gender: "men" | "women" | "kid" | "unisex"
  categoryId: string
  images?: FileList
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter()

  const { handleSubmit, register, getValues, setValue, watch } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      tags: product.tags?.join(", "),
      sizes: product.sizes ?? [],
      images: undefined
    },
  })

  watch("sizes") // Actualizar las tallas en cada cambio

  const onSizeChanged = (size: string) => {
    const sizes = new Set(getValues("sizes"))
    // sizes.has(size) ? sizes.delete(size) : sizes.add(size)
    if (sizes.has(size)) {
      sizes.delete(size)
    } else {
      sizes.add(size)
    }
    setValue("sizes", Array.from(sizes))
  }

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData() // Crear el objeto del formulario

    const { images, ...productToSave } = data

    if (product.id) formData.append("id", product.id ?? "")
    
    formData.append("title", productToSave.title)
    formData.append("slug", productToSave.slug)
    formData.append("description", productToSave.description)
    formData.append("price", productToSave.price.toString())
    formData.append("inStock", productToSave.inStock.toString())
    formData.append("sizes", productToSave.sizes.toString())
    formData.append("tags", productToSave.tags)
    formData.append("categoryId", productToSave.categoryId)
    formData.append("gender", productToSave.gender)

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i])
      }
    }

    // Redireccionar al slug actualizado
    const { ok, product: updatedProduct } = await createUpdateProduct(formData)
    
    if (!ok) {
      alert('El producto no se pudo actualizar')
      
      return
    }

    router.replace(`/admin/product/${updatedProduct?.slug}`)
  }

  return (
    <form
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Título</span>
          <input
            className="p-2 border rounded-md bg-gray-200"
            type="text"
            {...register("title", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input
            className="p-2 border rounded-md bg-gray-200"
            type="text"
            {...register("slug", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Descripción</span>
          <textarea
            {...register("description", { required: true })}
            rows={5}
            className="p-2 border rounded-md bg-gray-200"
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Precio</span>
          <input
            {...register("price", { required: true, min: 0 })}
            type="number"
            className="p-2 border rounded-md bg-gray-200"
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Etiquetas</span>
          <input
            className="p-2 border rounded-md bg-gray-200"
            type="text"
            {...register("tags", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Género</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register("gender", { required: true })}
          >
            <option value="">-- Seleccionar --</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="flex flex-col mb-2">
          <span>Categoría</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register("categoryId", { required: true })}
          >
            <option value="">-- Seleccionar --</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        <button className="btn-primary w-full">
          Guardar
        </button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Inventario</span>
          <input
            {...register("inStock", { required: true, min: 0 })}
            type="number"
            className="p-2 border rounded-md bg-gray-200"
          />
        </div>

        {/* As checkboxes */}
        <div className="flex flex-col">
          <span>Tallas</span>
          <div className="flex flex-wrap mb-2">
            {sizes.map(size => (
              <div
                className={clsx(
                  "p-2 border cursor-pointer rounded-md mr-2 mb-2 w-14 transition-all text-center",
                  {
                    "bg-blue-500 text-white": getValues("sizes").includes(size), // Obtener los valores que incluye 'size'
                  }
                )}
                key={size}
                onClick={() => onSizeChanged(size)}
              ><span>{size}</span></div>
            ))}
          </div>

          <div className="flex flex-col mb-2">
            <span>Fotos</span>
            <input
              className="p-2 border rounded-md bg-gray-200"
              type="file"
              multiple
              accept="image/png, image/jpeg, image/avif"
              {...register('images')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {product.ProductImage?.map((image) => (
              <div key={image.id}>
                <ProductImage
                  className="rounded-t shadow-md"
                  src={image.url}
                  width={300}
                  height={300}
                  alt={product.title ?? ''}
                />

                <button
                  className="btn-danger w-full rounded-b-xl"
                  type="button"
                  onClick={() => deleteProductImage(image.id, image.url)}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  )
}