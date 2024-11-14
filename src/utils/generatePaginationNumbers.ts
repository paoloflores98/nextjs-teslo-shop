// export const generatePaginationNumbers = (currentPage: number, totalPages: number) => {
//   // Verificar si el total de páginas es menor o igual a 7
//   if(totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1) // [1, 2, 3, 4, 5, 6, 7]
  
//   // Verificar si la página actual es una de las primeras 3 páginas
//   if(currentPage <= 3) return [1, 2, 3, '...', totalPages - 1, totalPages] // [1, 2, 3, '...' , 49, 50]
  
//   // Verificar si la página actual es una de las últimas 3 páginas
//   if(currentPage >= (totalPages - 2)) return [1, 2, 3, '...', totalPages -2, totalPages -1, totalPages] // [1, 2, 3, '...' , 48, 49, 50]
  
//   // Retornar si la página actual está en otro lugar
//   return [1, '...', (currentPage - 1), currentPage, (currentPage + 1), '...', totalPages] // [1, '...' , 37, 38, 39, '...' , 50]
// }

/* VÁLIDO */
export const generatePaginationNumbers = (currentPage: number, totalPages: number) => {
  if(totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
  
  const visiblePages = 3 // Número de páginas visibles en la paginación
  const halfVisible = Math.floor(visiblePages / 2)

  let startPage = Math.max(1, currentPage - halfVisible)
  let endPage = Math.min(totalPages, startPage + visiblePages - 1)

  if(endPage - startPage + 1 < visiblePages) {
    startPage = Math.max(1, endPage - visiblePages + 1)
  }

  const pages: (number | string)[] = [1, 2] // Mostrar siempre las dos primeras páginas

  // Agregar puntos suspensivos si hay un salto desde las primeras páginas
  if(startPage > 3) {
    pages.push('...')
  }

  // Agregar el rango de páginas visibles
  for(let i = Math.max(startPage, 3); i <= endPage; i++) {
    pages.push(i)
  }

  // Agregar puntos suspensivos y las últimas dos páginas si es necesario
  if(endPage < totalPages - 2) {
    pages.push('...', totalPages - 1, totalPages)
  }else if(endPage < totalPages - 1) {
    pages.push(totalPages - 1, totalPages)
  }else if(endPage < totalPages) {
    pages.push(totalPages)
  }

  return pages
}