import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import CartPage from '../features/cart/pages/CartPage'
import CheckoutPage from '../features/checkout/pages/CheckoutPage'
import ProductDetailPage from '../features/products/pages/ProductDetailPage'
import ProductListPage from '../features/products/pages/ProductListPage'
import OrderHistoryPage from '../features/orders/pages/OrderHistoryPage'
import NotFoundPage from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Navigate to="/products" replace /> },
      { path: '/products', element: <ProductListPage /> },
      { path: '/products/:productId', element: <ProductDetailPage /> },
      { path: '/cart', element: <CartPage /> },
      { path: '/checkout', element: <CheckoutPage /> },
      { path: '/orders', element: <OrderHistoryPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
