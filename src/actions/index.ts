// export * from "./product/get-product-by-slug"
// export * from "./product/get-stock-by-slug"
// export * from "./product/product-pagination"
export * from "./auth/login"
export * from "./auth/logout"

// Importaciones específicas
import { getPaginatedProductsWithImages } from "./product/product-pagination"
import { getProductBySlug } from "./product/get-product-by-slug"
import { getStockBySlug } from "./product/get-stock-by-slug"

// Exportaciones específicas
export { getPaginatedProductsWithImages, getProductBySlug, getStockBySlug }