import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { Input } from '../../../components/ui/Input'
import { Spinner } from '../../../components/ui/Spinner'
import { queryKeys } from '../../../api/queryKeys'
import { useToast } from '../../../components/ui/Toast'
import { toDisplayText } from '../../../api/utils'
import { useCartQuery } from '../../cart/hooks'
import { placeOrder } from '../api'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const toast = useToast()
  const cartQuery = useCartQuery()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  })

  const items = useMemo(() => cartQuery.data?.items ?? [], [cartQuery.data])

  const orderMutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: async () => {
      toast.success('Order placed successfully')
      await queryClient.invalidateQueries({ queryKey: queryKeys.cart })
      await queryClient.invalidateQueries({ queryKey: queryKeys.orders })
      navigate('/orders')
    },
    onError: (error) => {
      toast.error(error?.message || 'Could not place the order')
    },
  })

  const submitOrder = (event) => {
    event.preventDefault()
    orderMutation.mutate({
      ...form,
      items,
    })
  }

  if (cartQuery.isLoading) {
    return (
      <div className="grid place-items-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!items.length) {
    return (
      <EmptyState
        icon="Checkout"
        title="No items to checkout"
        description="Add products to your cart before placing an order."
        actionLabel="Go to products"
        onAction={() => navigate('/products')}
      />
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Card>
        <h2 className="text-2xl font-semibold text-white">Checkout</h2>
        <p className="mt-2 text-sm text-slate-400">
          Enter delivery details and submit the order to the live API.
        </p>

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={submitOrder}>
          <Input
            label="Full name"
            value={form.fullName}
            onChange={(event) => setForm({ ...form, fullName: event.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
          />
          <Input
            label="City"
            value={form.city}
            onChange={(event) => setForm({ ...form, city: event.target.value })}
            required
          />
          <label className="md:col-span-2 flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-200">Address</span>
            <textarea
              rows="4"
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-brand-400/50 focus:ring-2 focus:ring-brand-400/20"
              value={form.address}
              onChange={(event) => setForm({ ...form, address: event.target.value })}
              required
            />
          </label>
          <label className="md:col-span-2 flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-200">Notes</span>
            <textarea
              rows="4"
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-brand-400/50 focus:ring-2 focus:ring-brand-400/20"
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
            />
          </label>
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={orderMutation.isPending}>
              {orderMutation.isPending ? 'Placing order...' : 'Place order'}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Items</h3>
        <div className="space-y-3 text-sm text-slate-300">
          {items.map((item) => (
            <div
              key={item.id ?? item._id ?? item.cartItemId}
              className="flex justify-between gap-4"
            >
              <span>
                {toDisplayText(item?.product?.name ?? item?.name ?? item?.title, 'Item')}
              </span>
              <span>x{Number(item.quantity ?? 1)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
