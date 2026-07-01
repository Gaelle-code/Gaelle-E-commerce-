import { Input } from '../../../components/ui/Input'
import { toDisplayText } from '../../../api/utils'

export default function ProductFilters({
  search,
  category,
  categories = [],
  onSearchChange,
  onCategoryChange,
}) {
  return (
    <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 md:grid-cols-2">
      <Input
        label="Search products"
        placeholder="Search by name, brand, or keyword"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <label className="flex w-full flex-col gap-2">
        <span className="text-sm font-medium text-slate-200">Category</span>
        <select
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400/50 focus:ring-2 focus:ring-brand-400/20"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((item) => {
            const value =
              typeof item === 'string'
                ? item
                : item?.id || item?.slug || toDisplayText(item?.name || item?.label)
            const label = toDisplayText(item?.name ?? item?.label ?? item, value)
            return (
              <option key={value} value={value}>
                {label}
              </option>
            )
          })}
        </select>
      </label>
    </div>
  )
}
