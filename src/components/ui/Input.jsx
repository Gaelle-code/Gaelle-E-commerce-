export function Input({ label, hint, className = '', ...props }) {
  return (
    <label className="flex w-full flex-col gap-2">
      {label ? <span className="text-sm font-medium text-slate-200">{label}</span> : null}
      <input
        className={[
          'w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-brand-400/50 focus:ring-2 focus:ring-brand-400/20',
          className,
        ].join(' ')}
        {...props}
      />
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  )
}
