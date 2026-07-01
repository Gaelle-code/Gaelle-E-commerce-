import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ErrorState } from '../../../components/ui/ErrorState'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Skeleton } from '../../../components/ui/Skeleton'
import { useCategoriesQuery, useProductsQuery } from '../hooks'
import ProductFilters from '../components/ProductFilters'
import ProductGrid from '../components/ProductGrid'
import { useDebouncedValue } from '../../../hooks/useDebouncedValue'

const DEFAULT_LIMIT = 12

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') || ''
  const categoryId = searchParams.get('categoryId') || ''
  const page = Number(searchParams.get('page') || '1')
  const [searchInput, setSearchInput] = useState(search)
  const debouncedSearch = useDebouncedValue(searchInput, 350)

  const params = useMemo(
    () => ({
      q: search || undefined,
      search: search || undefined,
      categoryId: categoryId || undefined,
      page,
      limit: DEFAULT_LIMIT,
    }),
    [search, categoryId, page],
  )

  const productsQuery = useProductsQuery(params)
  const categoriesQuery = useCategoriesQuery()

  const products = productsQuery.data?.items ?? []
  const pagination = productsQuery.data?.pagination
  const rawResponse = productsQuery.data?.raw
  const rawResponseKeys =
    rawResponse && typeof rawResponse === 'object' && !Array.isArray(rawResponse)
      ? Object.keys(rawResponse)
      : []

  const updateParams = useCallback((nextValues) => {
    const nextParams = new URLSearchParams(searchParams)

    Object.entries(nextValues).forEach(([key, value]) => {
      if (value == null || value === '') {
        nextParams.delete(key)
      } else {
        nextParams.set(key, String(value))
      }
    })

    setSearchParams(nextParams, { replace: true })
  }, [searchParams, setSearchParams])

  useEffect(() => {
    setSearchInput(search)
  }, [search])

  useEffect(() => {
    if (debouncedSearch !== search) {
      updateParams({ q: debouncedSearch, page: 1 })
    }
  }, [debouncedSearch, search, updateParams])

  if (productsQuery.isError) {
    return (
      <ErrorState
        message={productsQuery.error?.message || 'Unable to load products.'}
        onRetry={() => productsQuery.refetch()}
      />
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-brand-500/15 via-white/5 to-transparent p-8 shadow-soft">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-200/90">
          E-Comus catalog
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
          Shop smarter with curated products and a faster checkout experience.
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
          Find what you need, compare quickly, and buy with confidence.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button as={Link} to="/cart">
            Open cart
          </Button>
          <Button as={Link} to="/orders" variant="secondary">
            View orders
          </Button>
        </div>
      </section>

      {categoriesQuery.isError ? (
        <Card className="border-amber-500/20 bg-amber-500/10 text-amber-50">
          Could not load categories: {categoriesQuery.error?.message}
        </Card>
      ) : null}

      <ProductFilters
        search={searchInput}
        category={categoryId}
        categories={categoriesQuery.data || []}
        onSearchChange={(value) => setSearchInput(value)}
        onCategoryChange={(value) => updateParams({ categoryId: value, page: 1 })}
      />

      {productsQuery.isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
            <Card key={index} className="p-0">
              <Skeleton className="aspect-square rounded-none rounded-t-3xl" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          <ProductGrid products={products} />
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-300">
              Page {pagination?.page ?? page} of {pagination?.totalPages ?? 1}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={page <= 1 || productsQuery.isFetching}
                onClick={() => updateParams({ page: Math.max(1, page - 1) })}
              >
                Previous
              </Button>
              <Button
                disabled={!pagination?.hasNextPage || productsQuery.isFetching}
                onClick={() => updateParams({ page: page + 1 })}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          icon="Search"
          title="No products found"
          description="Try a different search term or category filter."
          actionLabel="Clear filters"
          onAction={() => setSearchParams(new URLSearchParams(), { replace: true })}
        />
      )}
    </div>
  )
}
