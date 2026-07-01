import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ErrorState } from '../../../components/ui/ErrorState'
import { Spinner } from '../../../components/ui/Spinner'
import { queryKeys } from '../../../api/queryKeys'
import { useToast } from '../../../components/ui/Toast'
import {
  useCartQuery,
  useClearCartMutation,
  useRemoveCartItemMutation,
  useUpdateCartItemQuantityMutation,
} from '../hooks'
import CartItem from '../components/CartItem'
import CartSummary from '../components/CartSummary'

export default function CartPage() {
  const cartQuery = useCartQuery()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const toast = useToast()
  const clearCartMutation = useClearCartMutation({
    onSuccess: async () => {
      toast.success('Cart cleared')
      await refreshCart()
    },
    onError: (error) => toast.error(error?.message || 'Could not clear the cart'),
  })

  const refreshCart = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.cart })
  }

  const updateQuantityMutation = useUpdateCartItemQuantityMutation({
    onSuccess: async () => {
      toast.success('Cart updated')
      await refreshCart()
    },
    onError: (error) => toast.error(error?.message || 'Could not update the cart'),
  })

  const removeMutation = useRemoveCartItemMutation({
    onSuccess: async () => {
      toast.success('Item removed')
      await refreshCart()
    },
    onError: (error) => toast.error(error?.message || 'Could not remove the item'),
  })

  const items = useMemo(() => cartQuery.data?.items ?? [], [cartQuery.data])
  const summary = cartQuery.data?.summary ?? {}

  if (cartQuery.isLoading) {
    return (
      <div className="grid place-items-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (cartQuery.isError) {
    return (
      <ErrorState
        message={cartQuery.error?.message || 'Unable to load your cart.'}
        onRetry={() => cartQuery.refetch()}
      />
    )
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon="Cart"
        title="Your cart is empty"
        description="Add products from the catalog to continue to checkout."
        actionLabel="Browse products"
        onAction={() => navigate('/products')}
      />
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Shopping cart</h2>
          <p className="mt-2 text-sm text-slate-400">Review item quantities before checkout.</p>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <CartItem
              key={item.id ?? item._id ?? item.cartItemId}
              item={item}
              busy={updateQuantityMutation.isPending || removeMutation.isPending}
              onIncrease={() =>
                updateQuantityMutation.mutate({
                  itemId: item.id ?? item._id ?? item.cartItemId,
                  quantity: Number(item.quantity ?? 1) + 1,
                })
              }
              onDecrease={() =>
                updateQuantityMutation.mutate({
                  itemId: item.id ?? item._id ?? item.cartItemId,
                  quantity: Math.max(1, Number(item.quantity ?? 1) - 1),
                })
              }
              onRemove={() =>
                removeMutation.mutate(item.id ?? item._id ?? item.cartItemId)
              }
            />
          ))}
        </div>
      </section>

      <aside className="space-y-4">
        <CartSummary
          summary={summary}
          items={items}
          busy={
            updateQuantityMutation.isPending ||
            removeMutation.isPending ||
            clearCartMutation.isPending
          }
          onCheckout={() => navigate('/checkout')}
        />
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
          <p className="font-medium text-white">Need a quick next step?</p>
          <p className="mt-2 leading-6">
            Keep shopping or move straight to checkout once the cart looks right.
          </p>
          <Link to="/products" className="mt-4 inline-flex text-brand-200 hover:text-brand-100">
            Continue shopping
          </Link>
          <button
            type="button"
            className="mt-4 inline-flex text-sm font-medium text-rose-300 hover:text-rose-200"
            onClick={() => clearCartMutation.mutate()}
            disabled={clearCartMutation.isPending}
          >
            Clear cart
          </button>
        </div>
      </aside>
    </div>
  )
}
