import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export default function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <Card className="max-w-lg text-center">
        <p className="text-sm text-slate-400">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          The page you are looking for does not exist.
        </p>
        <Button as={Link} to="/products" className="mt-6">
          Back to products
        </Button>
      </Card>
    </div>
  )
}
