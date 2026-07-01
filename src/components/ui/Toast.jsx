import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((toastId) => {
    setToasts((current) => current.filter((toast) => toast.id !== toastId))
  }, [])

  const pushToast = useCallback((toast) => {
    const id = crypto.randomUUID()
    setToasts((current) => [...current, { id, ...toast }])
    window.setTimeout(() => dismiss(id), toast.duration ?? 3500)
  }, [dismiss])

  const value = useMemo(
    () => ({
      success: (message) => pushToast({ tone: 'success', message }),
      error: (message) => pushToast({ tone: 'error', message }),
      info: (message) => pushToast({ tone: 'info', message }),
      dismiss,
    }),
    [dismiss, pushToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}

function Toaster({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={[
            'pointer-events-auto rounded-2xl border px-4 py-3 shadow-soft backdrop-blur',
            toast.tone === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-50'
              : toast.tone === 'error'
                ? 'border-rose-500/30 bg-rose-500/15 text-rose-50'
                : 'border-white/10 bg-slate-900/95 text-slate-100',
          ].join(' ')}
        >
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm leading-6">{toast.message}</p>
            <button
              type="button"
              className="text-xs font-medium text-slate-300 hover:text-white"
              onClick={() => onDismiss(toast.id)}
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
