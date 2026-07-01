import { EmptyState } from '../../../components/ui/EmptyState'
import { ErrorState } from '../../../components/ui/ErrorState'
import { Spinner } from '../../../components/ui/Spinner'
import OrderCard from '../components/OrderCard'
import { useOrdersQuery } from '../hooks'

export default function OrderHistoryPage() {
  const ordersQuery = useOrdersQuery()
  const orders = ordersQuery.data ?? []

  if (ordersQuery.isLoading) {
    return (
      <div className="grid place-items-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (ordersQuery.isError) {
    return (
      <ErrorState
        message={ordersQuery.error?.message || 'Unable to load order history.'}
        onRetry={() => ordersQuery.refetch()}
      />
    )
  }

  if (!orders.length) {
    return (
      <EmptyState
        icon="Orders"
        title="No orders yet"
        description="Once checkout is connected to the API, placed orders will appear here."
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Order history</h2>
        <p className="mt-2 text-sm text-slate-400">Track completed and pending purchases.</p>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <OrderCard key={order.id ?? order._id ?? order.orderId} order={order} />
        ))}
      </div>
    </div>
  )
}
