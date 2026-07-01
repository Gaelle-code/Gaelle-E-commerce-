import { apiClient } from '../../api/client'
import { apiPaths } from '../../api/endpoints'
import { buildPath, readCollection } from '../../api/utils'
import { getUserId } from '../../api/session'

export async function getComments(productId) {
  const response = await apiClient.get(apiPaths.comments, { params: { productId } })
  return readCollection(response.data, ['comments', 'items', 'results', 'data'])
}

export async function createComment({ productId, rating, comment }) {
  const response = await apiClient.post(apiPaths.comments, {
    userId: getUserId(),
    productId,
    rating,
    comment,
  })
  return response.data
}

export async function reactToComment({ commentId, reaction }) {
  const response = await apiClient.post(
    buildPath(apiPaths.commentReact, { commentId }),
    { userId: getUserId(), reaction },
  )
  return response.data
}

export async function deleteComment(commentId) {
  const response = await apiClient.delete(
    buildPath(apiPaths.commentDelete, { commentId }),
    { data: { userId: getUserId() } },
  )
  return response.data
}
