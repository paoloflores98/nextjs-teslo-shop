export const generatePaginationNumbers = (currentPage: number, totalPages: number) => {
  // Verificar si el total de páginas es menor o igual a 7
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1) // [1, 2, 3, 4, 5, 6, 7]
  
  // Verificar si la página actual es una de las primeras 3 páginas
  if (currentPage <= 3) return [1, 2, 3, '...', totalPages - 1, totalPages] // [1, 2, 3, '...' , 49, 50]
  
  // Verificar si la página actual es una de las últimas 3 páginas
  if (currentPage >= totalPages - 2) return [1, 2, 3, '...', totalPages -2, totalPages -1, totalPages] // [1, 2, 3, '...' , 48, 49, 50]
  
  // Retornar si la página actual está en otro lugar
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages] // [1, '...' , 37, 38, 39, '...' , 50]
}