export const queryKeys = {
  products: ['products'],
  product: (productId) => ['product', productId],
  categories: ['categories'],
  cart: ['cart'],
  orders: ['orders'],
  comments: (productId) => ['comments', productId],
  variants: (productId) => ['variants', productId],
}
