import { apiClient } from '../../api/client'
import { apiPaths } from '../../api/endpoints'
import { buildPath, readCollection } from '../../api/utils'

export async function getVariants(productId) {
  const response = await apiClient.get(
    buildPath(apiPaths.productVariants, { productId }),
  )
  return readCollection(response.data, ['variants', 'items', 'results', 'data'])
}
