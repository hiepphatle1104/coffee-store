import { Button } from '@/components/ui'
import { Link } from 'react-router'

export const Home = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Home</h1>
      <p className="text-lg">Welcome to the home page!</p>

      <div className="space-x-2 mt-4">
        <Link to={'/home/all'}>
          <Button className="w-48!">Make Orders</Button>
        </Link>

        <Link to={'/admin/orders'}>
          <Button className="w-48!">Admin Page</Button>
        </Link>
      </div>
    </div>
  )
}
