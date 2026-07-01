export function Card({ className = '', ...props }) {
  return (
    <div
      className={[
        'rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur',
        className,
      ].join(' ')}
      {...props}
    />
  )
}
