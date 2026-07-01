import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { getImageUrl, getProductFallbackImage, toDisplayText } from '../../../api/utils'

export default function ProductCard({ product }) {
  const productId = product?.id ?? product?._id ?? product?.productId
  const title = toDisplayText(product?.name ?? product?.title, 'Untitled product')
  const category = toDisplayText(product?.category ?? product?.brand, 'Uncategorized')
  const price = product?.price ?? product?.salePrice ?? product?.unitPrice
  const [imageFailed, setImageFailed] = useState(false)

  const apiImage = getImageUrl(
    product?.image ?? product?.thumbnail ?? product?.images ?? product?.variants ?? product?.media,
  )
  const image = (!apiImage || imageFailed)
    ? getProductFallbackImage(title, category)
    : apiImage

  return (
    <Card className="flex h-full flex-col overflow-hidden p-0">
      <div className="aspect-square bg-slate-900">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-lg font-semibold text-white">{title}</h3>
          {price != null ? <Badge>${Number(price).toFixed(2)}</Badge> : null}
        </div>
        <p className="text-sm text-slate-400">{category}</p>
        <div className="mt-auto flex items-center gap-3">
          <Button as={Link} to={`/products/${productId}`} className="flex-1">
            View details
          </Button>
        </div>
      </div>
    </Card>
  )
}
