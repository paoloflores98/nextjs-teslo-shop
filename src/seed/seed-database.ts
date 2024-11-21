import prisma from "../lib/prisma"
import { initialData } from "./seed"

async function main() {
  // Borrar registros previos
  await prisma.user.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  const { categories, products, users } = initialData // Desestructurar de seed.ts

  // Insertar usuarios de prueba
  await prisma.user.createMany({
    data: users
  })

  // Insertar categorías
  const categoriesData = categories.map(category => ({
    name: category
  }))
  await prisma.category.createMany({
    data: categoriesData
  })

  // Crear un arreglo de objetos de categorías donde el nombre como clave y el ID como valor
  const categoriesdDB = await prisma.category.findMany()
  const categoriesMap = categoriesdDB.reduce((map, category) => {
    map[category.name.toLowerCase()] = category.id // Ejemplo: {'shirts': '4c20b765-b49f-49f9-8778-1894d90a225f'}
    return map
  }, {} as Record<string, string>)

  // Insertar productos
  products.forEach(async(product) => {
    const { type, images, ...rest } = product
    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type] // Ej: categoriesMap['shirts'] = '4c20b765-b49f-49f9-8778-1894d90a225f'
      }
    })

    // Insertar las imágenes de los productos
    const imageData = images.map(image => ({ // Ej: ['1740507-00-A_0_2000.jpg', '1740507-00-A_1.jpg']
      url: image,
      productId: dbProduct.id
    }))
    await prisma.productImage.createMany({ // Ej: [ {url: '1740507-00-A_0_2000.jpg',productId: 'c9c12f9a-66cd-4051-913b-cd4d7c5757b8' }, ... ]
      data: imageData
    })
  })

  console.log('Semilla ejecutada')
}

// Función anónima autoinvocada
(() => {
  if(process.env.NODE_ENV === 'production') return
  main()
})()