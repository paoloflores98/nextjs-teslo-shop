// export * from "./product/get-product-by-slug"
// export * from "./product/get-stock-by-slug"
// export * from "./product/product-pagination"
export { setUserAddress, createOrReplaceAddress } from "./address/set-user-address"
export { getUserAddress } from "./address/get-user-address"
export { deleteUserAddress } from "./address/delete-user-address"

export { login, authenticate } from "./auth/login"
export { logout } from "./auth/logout"
export { registerUser } from "./auth/register"

export { getCountries } from "./country/get-countries"

export { placeOrder } from "./order/place-order"
export { getOrderById } from "./order/get-order-by-id"
export { getOrdersByUser } from "./order/get-orders-by-user"

// Importaciones específicas
export { getProductBySlug } from "./product/get-product-by-slug"
export { getStockBySlug } from "./product/get-stock-by-slug"
export { getPaginatedProductsWithImages } from "./product/product-pagination"

// Exportaciones específicas
// export { getPaginatedProductsWithImages, getProductBySlug, getStockBySlug }