import { Link, NavLink } from 'react-router-dom'
import logo from '../../public/assets/images/logo.jpg'
import { useCartQuery } from '../../features/cart/hooks'
import { Badge } from '../ui/Badge'

const navLinkClass = ({ isActive }) =>
  [
    'rounded-full px-3 py-2 text-sm font-medium transition',
    isActive
      ? 'bg-white/10 text-white'
      : 'text-slate-300 hover:bg-white/5 hover:text-white',
  ].join(' ')

export default function Header() {
  const { data: cart } = useCartQuery()
  const cartCount =
    cart?.summary?.itemCount ??
    cart?.items?.reduce((total, item) => total + Number(item?.quantity ?? 1), 0) ??
    0

  return (
    <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="app-container flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <Link to="/products" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-500/20 text-brand-200 ring-1 ring-brand-400/20">
            <img src={logo} alt="Logo" className="h-6 w-6 rounded-xl object-cover" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Smart shopping made simple</p>
            <h1 className="text-lg font-semibold text-white">Gaelle Online Shop</h1>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>
          <NavLink to="/cart" className={navLinkClass}>
            Cart {cartCount > 0 ? <Badge className="ml-1">{cartCount}</Badge> : null}
          </NavLink>
          <NavLink to="/orders" className={navLinkClass}>
            Orders
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
