import Link from 'next/link'
import { FaCarSide, FaHome, FaSearch } from 'react-icons/fa'

export const metadata = {
  title: 'Page Not Found | DriveSphere',
  description: 'The requested DriveSphere page could not be found.',
}

export default function NotFound() {

  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center bg-gray-50 px-4 py-16 transition-colors duration-300 dark:bg-slate-900 sm:px-6 lg:px-8">

      <section className="mx-auto w-full max-w-4xl text-center">

        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-slate-800 dark:text-green-400">
          <FaSearch
            className="text-3xl"
            aria-hidden="true"
          />
        </div>

        {/* Text */}
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.3em] text-green-700 dark:text-green-400">
          404
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-tight text-gray-950 dark:text-white sm:text-5xl">
          This route is off the map
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-400 sm:text-lg">
          The page you are looking for does not exist, moved, or is not ready
          for bookings yet.
        </p>

        {/* Buttons */}
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700"
          >
            <FaHome aria-hidden="true" />
            Back Home
          </Link>

          <Link
            href="/cars"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-700 px-5 py-3 text-sm font-bold text-green-800 transition-all duration-200 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-slate-800"
          >
            <FaCarSide aria-hidden="true" />
            Explore Cars
          </Link>
        </div>
      </section>
    </main>
  )
}