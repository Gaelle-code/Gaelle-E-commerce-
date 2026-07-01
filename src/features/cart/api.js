import { apiClient } from '../../api/client'
import { apiPaths } from '../../api/endpoints'
import { buildPath, readCollection, readObject } from '../../api/utils'
import { getUserId } from '../../api/session'

const cartItemPath = (itemId) => buildPath(apiPaths.cartItem, { itemId })

export async function getCart(userId = getUserId()) {
  const response = await apiClient.get(apiPaths.cart, { params: { userId } })
  const payload = readObject(response.data) || response.data
  const items = readCollection(payload, ['items', 'lineItems', 'cartItems'])
  const summary = payload?.summary || payload?.totals || {}
  return { ...payload, items, summary }
}

export async function addCartItem(payload) {
  const response = await apiClient.post(apiPaths.cartItems, {
    userId: getUserId(),
    ...payload,
  })
  return response.data
}

export async function updateCartItemQuantity({ itemId, quantity }) {
  const response = await apiClient.patch(cartItemPath(itemId), {
    userId: getUserId(),
    quantity,
  })
  return response.data
}

export async function removeCartItem(itemId) {
  const response = await apiClient.delete(cartItemPath(itemId), {
    data: { userId: getUserId() },
  })
  return response.data
}

export async function clearCart() {
  const response = await apiClient.delete(apiPaths.cart, {
    data: { userId: getUserId() },
  })
  return response.data
}
