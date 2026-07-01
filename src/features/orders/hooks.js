import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../api/queryKeys'
import { getUserId } from '../../api/session'
import { getOrders } from './api'

export function useOrdersQuery() {
  return useQuery({
    queryKey: [...queryKeys.orders, getUserId()],
    queryFn: () => getOrders(getUserId()),
  })
}
