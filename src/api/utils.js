export const buildPath = (template, values = {}) =>
  template.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    const value = values[key]
    return value == null ? '' : encodeURIComponent(String(value))
  })

export const toDisplayText = (value, fallback = '') => {
  if (value == null || value === '') {
    return fallback
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value.map((entry) => toDisplayText(entry)).filter(Boolean).join(', ') || fallback
  }

  if (typeof value === 'object') {
    return (
      value.name ??
      value.title ??
      value.label ??
      value.value ??
      value.slug ??
      value.id ??
      fallback
    )
  }

  return fallback
}

export const getImageUrl = (value, fallback = '') => {
  if (!value) {
    return fallback
  }

  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      const resolved = getImageUrl(entry)
      if (resolved) {
        return resolved
      }
    }
    return fallback
  }

  if (typeof value === 'object') {
    const directUrl =
      value.url ||
      value.secure_url ||
      value.src ||
      value.imageUrl ||
      value.path ||
      value.fileUrl

    if (directUrl) {
      return directUrl
    }

    return (
      getImageUrl(value.images) ||
      getImageUrl(value.image) ||
      getImageUrl(value.thumbnail) ||
      getImageUrl(value.variants) ||
      fallback
    )
  }

  return fallback
}

// Keyword → Unsplash image URL (800×800, free, no auth needed)
const KEYWORD_IMAGE_MAP = [
  ['macbook', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop'],
  ['ipad', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop'],
  ['iphone', 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=800&fit=crop'],
  ['apple watch', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=800&fit=crop'],
  ['sony', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop'],
  ['headphone', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop'],
  ['bose', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop'],
  ['samsung', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop'],
  ['playstation', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=800&fit=crop'],
  ['xbox', 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&h=800&fit=crop'],
  ['nintendo', 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&h=800&fit=crop'],
  ['keyboard', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=800&fit=crop'],
  ['mouse', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop'],
  ['logitech', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop'],
  ['kindle', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=800&fit=crop'],
  ['tv', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=800&h=800&fit=crop'],
  ['oled', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=800&h=800&fit=crop'],
  ['dyson', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'],
  ['vacuum', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'],
  ['gopro', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop'],
  ['camera', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop'],
  ['drone', 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=800&fit=crop'],
  ['dji', 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=800&fit=crop'],
  ['sonos', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop'],
  ['speaker', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop'],
  ['watch', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop'],
  ['sneaker', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop'],
  ['shoe', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop'],
  ['boot', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop'],
  ['jacket', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop'],
  ['coat', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop'],
  ['hoodie', 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&h=800&fit=crop'],
  ['sweater', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop'],
  ['cardigan', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop'],
  ['jeans', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop'],
  ['denim', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop'],
  ['chino', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=800&fit=crop'],
  ['trouser', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=800&fit=crop'],
  ['dress', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=800&fit=crop'],
  ['shirt', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=800&fit=crop'],
  ['tee', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop'],
  ['t-shirt', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop'],
  ['legging', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&h=800&fit=crop'],
  ['yoga', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&h=800&fit=crop'],
  ['scarf', 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&h=800&fit=crop'],
  ['beanie', 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&h=800&fit=crop'],
  ['sunglasses', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop'],
  ['bag', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop'],
  ['backpack', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop'],
]

export const getProductFallbackImage = (name = '', category = '') => {
  const text = `${name} ${category}`.toLowerCase()
  for (const [keyword, url] of KEYWORD_IMAGE_MAP) {
    if (text.includes(keyword)) return url
  }
  // generic product fallback
  return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop'
}

const unwrap = (payload) => {
  const current = payload
  const wrapperKeys = ['data', 'payload', 'result', 'results', 'items', 'products']

  if (!current || Array.isArray(current)) {
    return current
  }

  for (const key of wrapperKeys) {
    const value = current[key]
    if (Array.isArray(value) || (value && typeof value === 'object')) {
      return value
    }
  }

  return current
}

const isPlainObject = (value) =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const isLikelyProductArray = (value) =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.some((item) => isPlainObject(item)) &&
  value.some((item) => 'id' in item || '_id' in item || 'name' in item || 'title' in item)

const findArrayDeep = (value, visited = new WeakSet()) => {
  if (!value || typeof value !== 'object') {
    return null
  }

  if (visited.has(value)) {
    return null
  }

  visited.add(value)

  if (Array.isArray(value)) {
    return isLikelyProductArray(value) ? value : null
  }

  for (const entry of Object.values(value)) {
    if (Array.isArray(entry)) {
      if (isLikelyProductArray(entry)) {
        return entry
      }
      const nestedArray = findArrayDeep(entry, visited)
      if (nestedArray) {
        return nestedArray
      }
    } else if (isPlainObject(entry)) {
      const nestedArray = findArrayDeep(entry, visited)
      if (nestedArray) {
        return nestedArray
      }
    }
  }

  return null
}

const findTopLevelArray = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const preferredKeys = ['all', 'items', 'products', 'results', 'data']
  for (const key of preferredKeys) {
    const value = payload[key]
    if (Array.isArray(value)) {
      return value
    }
  }

  return null
}

export const readCollection = (payload, keys = ['items', 'products', 'results', 'data']) => {
  if (Array.isArray(payload)) {
    return payload
  }

  const direct = findTopLevelArray(payload)
  if (direct) {
    return direct
  }

  for (const key of keys) {
    const value = payload?.[key]
    if (Array.isArray(value)) {
      return value
    }
    if (value && typeof value === 'object') {
      const nested = readCollection(value, keys)
      if (nested.length > 0) {
        return nested
      }
    }
  }

  const unwrapped = unwrap(payload)
  if (Array.isArray(unwrapped)) {
    return unwrapped
  }

  const unwrappedDirect = findTopLevelArray(unwrapped)
  if (unwrappedDirect) {
    return unwrappedDirect
  }

  const discovered = findArrayDeep(unwrapped)
  if (discovered) {
    return discovered
  }

  for (const key of keys) {
    const value = unwrapped?.[key]
    if (Array.isArray(value)) {
      return value
    }
    if (value && typeof value === 'object') {
      const nested = readCollection(value, keys)
      if (nested.length > 0) {
        return nested
      }
    }
  }

  return []
}

export const readObject = (payload) => {
  if (!payload || Array.isArray(payload)) {
    return null
  }

  return payload.data || payload.item || payload.product || payload.result || payload
}

export const readPagination = (payload, currentPage = 1, pageSize = 12) => {
  const meta =
    payload?.meta ||
    payload?.pagination ||
    payload?.pageInfo ||
    payload?.data?.meta ||
    payload?.data?.pagination ||
    payload?.data?.pageInfo ||
    payload?.result?.meta ||
    payload?.result?.pagination ||
    payload?.result?.pageInfo ||
    {}
  const totalItems =
    meta.totalItems ??
    meta.total ??
    payload?.totalItems ??
    payload?.total ??
    payload?.data?.totalItems ??
    payload?.data?.total ??
    0
  const totalPages =
    meta.totalPages ??
    meta.pages ??
    payload?.totalPages ??
    payload?.data?.totalPages ??
    (totalItems ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1)
  const page =
    meta.page ??
    meta.currentPage ??
    payload?.page ??
    payload?.currentPage ??
    payload?.data?.page ??
    payload?.data?.currentPage ??
    currentPage

  return {
    page,
    pageSize: meta.pageSize ?? payload?.pageSize ?? payload?.data?.pageSize ?? pageSize,
    totalItems,
    totalPages,
    hasNextPage: Boolean(
      meta.hasNextPage ??
      payload?.hasNextPage ??
      payload?.data?.hasNextPage ??
      page < totalPages,
    ),
    hasPreviousPage: Boolean(
      meta.hasPreviousPage ??
      payload?.hasPreviousPage ??
      payload?.data?.hasPreviousPage ??
      page > 1,
    ),
  }
}
