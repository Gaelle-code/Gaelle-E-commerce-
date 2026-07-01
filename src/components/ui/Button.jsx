export function Button({
  as: Component = 'button',
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}) {
  const variants = {
    primary: 'bg-brand-500 text-white hover:bg-brand-400',
    secondary: 'bg-white/10 text-white hover:bg-white/15',
    ghost: 'bg-transparent text-slate-200 hover:bg-white/5',
    danger: 'bg-rose-500 text-white hover:bg-rose-400',
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  }

  return (
    <Component
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-brand-400/60 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      {...props}
    />
  )
}
