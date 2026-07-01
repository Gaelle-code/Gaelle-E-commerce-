import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../api/queryKeys'
import { createComment, deleteComment, getComments, reactToComment } from './api'

export function useCommentsQuery(productId) {
  return useQuery({
    queryKey: queryKeys.comments(productId),
    queryFn: () => getComments(productId),
    enabled: Boolean(productId),
  })
}

export function useCreateCommentMutation(productId, options = {}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createComment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.comments(productId) })
    },
    ...options,
  })
}

export function useReactToCommentMutation(productId, options = {}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reactToComment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.comments(productId) })
    },
    ...options,
  })
}

export function useDeleteCommentMutation(productId, options = {}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.comments(productId) })
    },
    ...options,
  })
}
