import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../api/queryKeys'
import { getVariants } from './api'

export function useVariantsQuery(productId) {
  return useQuery({
    queryKey: queryKeys.variants(productId),
    queryFn: () => getVariants(productId),
    enabled: Boolean(productId),
  })
}
