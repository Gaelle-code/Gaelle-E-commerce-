import { apiClient } from '../../api/client'
import { apiPaths } from '../../api/endpoints'
import { getUserId } from '../../api/session'

export async function placeOrder(payload) {
  const response = await apiClient.post(apiPaths.orders, {
    userId: getUserId(),
    ...payload,
  })
  return response.data
}

export async function buyNow(payload) {
  const response = await apiClient.post(apiPaths.orderBuy, {
    userId: getUserId(),
    ...payload,
  })
  return response.data
}
