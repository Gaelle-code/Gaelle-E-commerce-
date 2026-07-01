import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { toDisplayText } from '../../../api/utils'

export default function OrderCard({ order }) {
  const orderId = order?.id ?? order?._id ?? order?.orderId
  const status = toDisplayText(order?.status ?? order?.state, 'Pending')
  const total = order?.total ?? order?.grandTotal ?? order?.amount ?? 0
  const createdAt = order?.createdAt || order?.date || order?.placedAt

  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Order {orderId || '—'}</h3>
          <p className="mt-1 text-sm text-slate-400">{createdAt ? new Date(createdAt).toLocaleString() : 'Date unavailable'}</p>
        </div>
        <Badge>{status}</Badge>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>Total</span>
        <span className="font-semibold text-white">${Number(total).toFixed(2)}</span>
      </div>
    </Card>
  )
}
