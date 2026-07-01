import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { getImageUrl, getProductFallbackImage, toDisplayText } from '../../../api/utils'

export default function CartItem({ item, onIncrease, onDecrease, onRemove, busy = false }) {
  const product = item?.product ?? (typeof item?.productId === 'object' ? item.productId : null) ?? item
  const [imageFailed, setImageFailed] = useState(false)

  const title = toDisplayText(
    product?.name ?? product?.title ?? item?.name ?? item?.title,
    'Cart item',
  )
  const category = toDisplayText(product?.category ?? product?.brand, '')
  const price = item?.price ?? product?.price ?? product?.salePrice ?? 0
  const quantity = Number(item?.quantity ?? 1)

  const apiImage = getImageUrl(
    product?.image ??
      product?.thumbnail ??
      product?.images ??
      product?.variants?.[0]?.images ??
      product?.variants ??
      product?.media ??
      item?.image ??
      item?.thumbnail ??
      item?.images,
  )
  const image = (!apiImage || imageFailed)
    ? getProductFallbackImage(title, category)
    : apiImage

  return (
    <Card className="flex gap-4 p-4">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-900">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-slate-400">${Number(price).toFixed(2)} each</p>
          </div>
          <p className="text-sm font-medium text-slate-200">
            ${(Number(price) * quantity).toFixed(2)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onDecrease} disabled={busy || quantity <= 1}>
            -
          </Button>
          <span className="min-w-10 rounded-xl border border-white/10 px-3 py-2 text-center text-sm text-slate-100">
            {quantity}
          </span>
          <Button variant="secondary" size="sm" onClick={onIncrease} disabled={busy}>
            +
          </Button>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={onRemove} disabled={busy}>
            Remove
          </Button>
        </div>
      </div>
    </Card>
  )
}
