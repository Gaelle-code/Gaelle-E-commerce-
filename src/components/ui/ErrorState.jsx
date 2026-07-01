import { Button } from './Button'

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6">
      <h2 className="text-lg font-semibold text-rose-100">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-rose-50/80">{message}</p>
      {onRetry ? (
        <Button variant="secondary" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  )
}
