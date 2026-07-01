import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'

export default function CartSummary({ summary = {}, items = [], onCheckout, busy = false }) {
  const itemsTotal = items.reduce(
    (acc, item) => acc + Number(item?.price ?? item?.product?.price ?? 0) * Number(item?.quantity ?? 1),
    0,
  )
  const subtotal = summary.subtotal ?? summary.total ?? summary.amount ?? itemsTotal
  const shipping = summary.shipping ?? 0
  const tax = summary.tax ?? 0
  const total = summary.grandTotal ?? summary.totalAmount ?? subtotal + shipping + tax

  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Order summary</h2>
      <div className="space-y-3 text-sm text-slate-300">
        <Row label="Subtotal" value={subtotal} />
        <Row label="Shipping" value={shipping} />
        <Row label="Tax" value={tax} />
        <div className="border-t border-white/10 pt-3">
          <Row label="Total" value={total} strong />
        </div>
      </div>
      <Button className="w-full" onClick={onCheckout} disabled={busy}>
        Checkout
      </Button>
    </Card>
  )
}

function Row({ label, value, strong = false }) {
  return (
    <div className={['flex items-center justify-between', strong ? 'text-white' : ''].join(' ')}>
      <span>{label}</span>
      <span className={strong ? 'font-semibold' : ''}>${Number(value || 0).toFixed(2)}</span>
    </div>
  )
}
