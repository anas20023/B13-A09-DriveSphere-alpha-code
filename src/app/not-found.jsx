import Link from 'next/link'
import { FaCarSide, FaHome, FaSearch } from 'react-icons/fa'

export const metadata = {
  title: 'Page Not Found | DriveSphere',
  description: 'The requested DriveSphere page could not be found.',
}

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-4xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700">
          <FaSearch className="text-3xl" aria-hidden="true" />
        </div>

        <p className="mt-8 text-sm font-bold uppercase tracking-[0.3em] text-green-700">
          404
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
          This route is off the map
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
          The page you are looking for does not exist, moved, or is not ready
          for bookings yet.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800"
          >
            <FaHome aria-hidden="true" />
            Back Home
          </Link>
          <Link
            href="/cars"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-700 px-5 py-3 text-sm font-bold text-green-800 transition hover:bg-green-50"
          >
            <FaCarSide aria-hidden="true" />
            Explore Cars
          </Link>
        </div>
      </section>
    </main>
  )
}
