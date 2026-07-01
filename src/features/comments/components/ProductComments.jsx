import { useState } from 'react'
import { getUserId } from '../../../api/session'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Skeleton } from '../../../components/ui/Skeleton'
import { useToast } from '../../../components/ui/Toast'
import {
  useCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useReactToCommentMutation,
} from '../hooks'

export default function ProductComments({ productId }) {
  const toast = useToast()
  const commentsQuery = useCommentsQuery(productId)
  const [form, setForm] = useState({ rating: 5, comment: '' })

  const createMutation = useCreateCommentMutation(productId, {
    onSuccess: () => { toast.success('Comment posted'); setForm({ rating: 5, comment: '' }) },
    onError: (err) => toast.error(err?.message || 'Could not post comment'),
  })

  const reactMutation = useReactToCommentMutation(productId, {
    onError: (err) => toast.error(err?.message || 'Could not react'),
  })

  const deleteMutation = useDeleteCommentMutation(productId, {
    onSuccess: () => toast.success('Comment deleted'),
    onError: (err) => toast.error(err?.message || 'Could not delete comment'),
  })

  const comments = commentsQuery.data ?? []
  const currentUserId = getUserId()

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Reviews</h2>

      {commentsQuery.isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-slate-400">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => {
            const id = c._id ?? c.id
            const isOwner = (c.userId === currentUserId) || (c.userId?._id === currentUserId)
            return (
              <Card key={id} className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-sm font-medium text-white">
                      {'★'.repeat(Number(c.rating ?? 0))}{'☆'.repeat(5 - Number(c.rating ?? 0))}
                    </span>
                    <p className="mt-1 text-sm text-slate-300">{c.comment ?? c.text ?? c.body}</p>
                  </div>
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(id)}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </Button>
                  )}
                </div>
                <div className="flex gap-3 text-xs text-slate-400">
                  <button
                    type="button"
                    className="hover:text-emerald-300 transition"
                    onClick={() => reactMutation.mutate({ commentId: id, reaction: 'like' })}
                  >
                    👍 {c.likes ?? c.reactions?.like ?? 0}
                  </button>
                  <button
                    type="button"
                    className="hover:text-rose-300 transition"
                    onClick={() => reactMutation.mutate({ commentId: id, reaction: 'dislike' })}
                  >
                    👎 {c.dislikes ?? c.reactions?.dislike ?? 0}
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Card className="space-y-4">
        <h3 className="text-base font-semibold text-white">Leave a review</h3>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            createMutation.mutate({ productId, ...form })
          }}
        >
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-200">Rating</span>
            <select
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-brand-400/50 focus:ring-2 focus:ring-brand-400/20"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} star{n !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-200">Comment</span>
            <textarea
              rows="3"
              required
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-brand-400/50 focus:ring-2 focus:ring-brand-400/20"
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              placeholder="Share your thoughts..."
            />
          </label>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Posting...' : 'Post review'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
