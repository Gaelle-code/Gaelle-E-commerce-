import ProductCard from './ProductCard'

export default function ProductGrid({ products = [] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id ?? product._id ?? product.productId} product={product} />
      ))}
    </div>
  )
}
