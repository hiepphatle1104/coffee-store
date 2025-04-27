import { Link } from 'react-router'

export const Error = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/" className="underline">
        Go back to the home page.
      </Link>
    </div>
  )
}
