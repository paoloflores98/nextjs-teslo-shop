// export * from "./product/get-product-by-slug"
// export * from "./product/get-stock-by-slug"
// export * from "./product/product-pagination"

export { login, authenticate } from "./auth/login"
export { logout } from "./auth/logout"
export * from "./auth/register"

// Importaciones específicas
import { getPaginatedProductsWithImages } from "./product/product-pagination"
import { getProductBySlug } from "./product/get-product-by-slug"
import { getStockBySlug } from "./product/get-stock-by-slug"

// Exportaciones específicas
export { getPaginatedProductsWithImages, getProductBySlug, getStockBySlug }