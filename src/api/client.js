import axios from 'axios'

const baseURL =
  import.meta.env.VITE_ECOMUS_API_BASE_URL?.trim() ||
  'https://e-commas-apis-production-e0f8.up.railway.app'

export const apiClient = axios.create({
  baseURL: baseURL || undefined,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status ?? 0
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Unexpected network error'

    return Promise.reject({
      message,
      status,
      raw: error,
    })
  },
)

export const isApiConfigured = Boolean(baseURL)
