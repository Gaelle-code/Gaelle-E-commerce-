export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="app-container flex flex-col gap-2 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <p>Built with React, Tailwind CSS, Axios, and TanStack Query.</p>
        <p>Prepared for a configurable E-Comus API integration.</p>
      </div>
    </footer>
  )
}
