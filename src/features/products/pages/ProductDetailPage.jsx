import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ErrorState } from '../../../components/ui/ErrorState'
import { Badge } from '../../../components/ui/Badge'
import { Skeleton } from '../../../components/ui/Skeleton'
import { useToast } from '../../../components/ui/Toast'
import { queryKeys } from '../../../api/queryKeys'
import { getImageUrl, getProductFallbackImage, toDisplayText } from '../../../api/utils'
import { addCartItem } from '../../cart/api'
import { buyNow } from '../../checkout/api'
import { useProductQuery } from '../hooks'
import { useVariantsQuery } from '../../variants/hooks'
import ProductComments from '../../comments/components/ProductComments'

export default function ProductDetailPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const queryClient = useQueryClient()
  const [quantity, setQuantity] = useState(1)
  const [selectedVariantId, setSelectedVariantId] = useState('')
  const [imageFailed, setImageFailed] = useState(false)

  const productQuery = useProductQuery(productId)
  const variantsQuery = useVariantsQuery(productId)

  const addItemMutation = useMutation({
    mutationFn: addCartItem,
    onSuccess: async () => {
      toast.success('Added to cart')
      await queryClient.invalidateQueries({ queryKey: queryKeys.cart })
      navigate('/cart')
    },
    onError: (error) => toast.error(error?.message || 'Could not add item to cart'),
  })

  const buyNowMutation = useMutation({
    mutationFn: buyNow,
    onSuccess: async () => {
      toast.success('Order placed')
      await queryClient.invalidateQueries({ queryKey: queryKeys.orders })
      navigate('/orders')
    },
    onError: (error) => toast.error(error?.message || 'Could not place the order'),
  })

  if (productQuery.isLoading) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Skeleton className="aspect-square rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-12 w-1/3" />
        </div>
      </div>
    )
  }

  if (productQuery.isError) {
    return (
      <ErrorState
        message={productQuery.error?.message || 'Unable to load product details.'}
        onRetry={() => productQuery.refetch()}
      />
    )
  }

  const product = productQuery.data

  if (!product) {
    return (
      <EmptyState
        icon="✦"
        title="Product not found"
        description="The selected product could not be loaded from the API."
        actionLabel="Back to products"
        onAction={() => navigate('/products')}
      />
    )
  }

  const title = toDisplayText(product?.name ?? product?.title, 'Untitled product')
  const category = toDisplayText(product?.category ?? product?.brand, 'Product')
  const price = product?.price ?? product?.salePrice ?? product?.unitPrice
  const description = toDisplayText(product?.description ?? product?.summary, 'No description available.')
  const variants = variantsQuery.data ?? []
  const pid = product.id ?? product._id ?? product.productId ?? productId

  const apiImage = getImageUrl(
    product?.image ?? product?.thumbnail ?? product?.images ?? product?.variants ?? product?.media,
  )
  const image = (!apiImage || imageFailed)
    ? getProductFallbackImage(title, category)
    : apiImage

  const cartPayload = {
    productId: pid,
    quantity,
    ...(selectedVariantId ? { variantId: selectedVariantId } : {}),
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden p-0">
          <div className="aspect-square bg-slate-900">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
              onError={() => setImageFailed(true)}
            />
          </div>
        </Card>

        <Card className="flex flex-col gap-6">
          <div>
            <Badge className="mb-3">{category}</Badge>
            <h1 className="text-3xl font-semibold text-white">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
            <div>
              <p className="text-sm text-slate-400">Price</p>
              <p className="text-2xl font-semibold text-white">
                {price != null ? `$${Number(price).toFixed(2)}` : 'N/A'}
              </p>
            </div>
            <Link to="/products" className="text-sm text-brand-200 hover:text-brand-100">
              Back to catalog
            </Link>
          </div>

          {variants.length > 0 && (
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-200">Variant</span>
              <select
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-brand-400/50 focus:ring-2 focus:ring-brand-400/20"
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
              >
                <option value="">Select a variant</option>
                {variants.map((v) => {
                  const vid = v._id ?? v.id
                  const label = toDisplayText(v.name ?? v.color ?? v.size ?? v.label, vid)
                  return (
                    <option key={vid} value={vid}>
                      {label}{v.price != null ? ` — $${Number(v.price).toFixed(2)}` : ''}
                    </option>
                  )
                })}
              </select>
            </label>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex flex-1 flex-col gap-2">
              <span className="text-sm font-medium text-slate-200">Quantity</span>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-brand-400/50 focus:ring-2 focus:ring-brand-400/20"
              />
            </label>
            <Button
              type="button"
              className="sm:mt-7 sm:flex-1"
              onClick={() => addItemMutation.mutate(cartPayload)}
              disabled={addItemMutation.isPending}
            >
              {addItemMutation.isPending ? 'Adding...' : 'Add to cart'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="sm:mt-7 sm:flex-1"
              onClick={() => buyNowMutation.mutate(cartPayload)}
              disabled={buyNowMutation.isPending}
            >
              {buyNowMutation.isPending ? 'Buying...' : 'Buy now'}
            </Button>
          </div>
        </Card>
      </div>

      <ProductComments productId={pid} />
    </div>
  )
}
