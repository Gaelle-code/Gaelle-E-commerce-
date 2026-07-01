import { useMutation, useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../api/queryKeys'
import { getUserId } from '../../api/session'
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItemQuantity,
} from './api'

export function useCartQuery() {
  return useQuery({
    queryKey: [...queryKeys.cart, getUserId()],
    queryFn: () => getCart(getUserId()),
  })
}

export function useAddCartItemMutation(options = {}) {
  return useMutation({
    mutationFn: addCartItem,
    ...options,
  })
}

export function useUpdateCartItemQuantityMutation(options = {}) {
  return useMutation({
    mutationFn: updateCartItemQuantity,
    ...options,
  })
}

export function useRemoveCartItemMutation(options = {}) {
  return useMutation({
    mutationFn: removeCartItem,
    ...options,
  })
}

export function useClearCartMutation(options = {}) {
  return useMutation({
    mutationFn: clearCart,
    ...options,
  })
}
