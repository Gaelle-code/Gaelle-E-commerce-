import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../api/queryKeys'
import {
  getCategories,
  getProduct,
  getProducts,
} from './api'

export function useProductsQuery(params = {}) {
  return useQuery({
    queryKey: [...queryKeys.products, params],
    queryFn: () => getProducts(params),
  })
}

export function useProductQuery(productId) {
  return useQuery({
    queryKey: queryKeys.product(productId),
    queryFn: () => getProduct(productId),
    enabled: Boolean(productId),
  })
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: getCategories,
  })
}
