export function Badge({ className = '', ...props }) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-200',
        className,
      ].join(' ')}
      {...props}
    />
  )
}
