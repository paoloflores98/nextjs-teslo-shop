export { setUserAddress, createOrReplaceAddress } from "./address/set-user-address"
export { getUserAddress } from "./address/get-user-address"
export { deleteUserAddress } from "./address/delete-user-address"

export { getCategories } from "./category/get-categories"

export { login, authenticate } from "./auth/login"
export { logout } from "./auth/logout"
export { registerUser } from "./auth/register"

export { getCountries } from "./country/get-countries"

export { placeOrder } from "./order/place-order"
export { getOrderById } from "./order/get-order-by-id"
export { getPaginatedOrders } from "./order/get-paginated-orders"
export { getOrdersByUser } from "./order/get-orders-by-user"

export { setTransactionId } from "./payments/set-transaction-id"
export { paypalCheckPayment, getPayPalBearerToken, verifyPayPalPayment } from "./payments/paypal-check-payment"

export { deleteProductImage } from "./product/delete-product-image"
export { createUpdateProduct, uploadImages } from "./product/create-update-product"
export { getProductBySlug } from "./product/get-product-by-slug"
export { getStockBySlug } from "./product/get-stock-by-slug"
export { getPaginatedProductsWithImages } from "./product/product-pagination"

export { changeUserRole } from "./user/change-user-role"
export { getPaginatedUsers } from "./user/get-paginater-users"