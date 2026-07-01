import { apiClient } from '../../api/client'
import { apiPaths } from '../../api/endpoints'
import { buildPath, readCollection, readObject, readPagination } from '../../api/utils'

export async function getProducts(params = {}) {
  const queryParams = {
    page: params.page,
    limit: params.limit,
    search: params.search ?? params.q,
    categoryId: params.categoryId ?? params.category,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    sortByPrice: params.sortByPrice,
  }

  if (queryParams.categoryId) {
    const categoryEndpoint = buildPath(apiPaths.productCategory, {
      categoryId: queryParams.categoryId,
    })
    const response = await apiClient.get(categoryEndpoint, { params: queryParams })
    const items = readCollection(response.data)
    const pagination = readPagination(
      response.data,
      Number(params.page || 1),
      Number(params.limit || 12),
    )

    return { items, pagination, raw: response.data }
  }

  const response = await apiClient.get(apiPaths.products, { params: queryParams })
  const items = readCollection(response.data)
  const pagination = readPagination(response.data, Number(params.page || 1), Number(params.limit || 12))

  return { items, pagination, raw: response.data }
}

export async function getProduct(productId) {
  const endpoint = buildPath(apiPaths.productDetail, { productId, id: productId })
  const response = await apiClient.get(endpoint)
  return readObject(response.data)
}

export async function getCategories() {
  const response = await apiClient.get(apiPaths.categories)
  return readCollection(response.data, ['categories', 'items', 'results', 'data'])
}
