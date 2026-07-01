export function Spinner({ className = '' }) {
  return (
    <div
      className={[
        'h-5 w-5 animate-spin rounded-full border-2 border-slate-500 border-t-brand-400',
        className,
      ].join(' ')}
      aria-label="Loading"
    />
  )
}
