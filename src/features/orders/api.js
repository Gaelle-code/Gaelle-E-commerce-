import { apiClient } from '../../api/client'
import { apiPaths } from '../../api/endpoints'
import { buildPath, readCollection } from '../../api/utils'
import { getUserId } from '../../api/session'

export async function getOrders(userId = getUserId()) {
  const response = await apiClient.get(apiPaths.orders, { params: { userId } })
  return readCollection(response.data, ['orders', 'items', 'results', 'data'])
}

export async function getOrder(orderId) {
  const response = await apiClient.get(buildPath(apiPaths.orderById, { orderId }))
  return response.data
}

export async function updateOrderStatus(orderId, status) {
  const response = await apiClient.patch(
    buildPath(apiPaths.orderStatus, { orderId }),
    { status },
  )
  return response.data
}
