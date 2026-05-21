'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { FaExclamationTriangle, FaHome, FaRedoAlt } from 'react-icons/fa'

export default function Error({ error, unstable_retry, reset }) {

  const retry = unstable_retry ?? reset

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center bg-gray-50 px-4 py-16 transition-colors duration-300 dark:bg-slate-900 sm:px-6 lg:px-8">

      <section className="mx-auto w-full max-w-4xl text-center">

        {/* Error Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          <FaExclamationTriangle
            className="text-3xl"
            aria-hidden="true"
          />
        </div>

        {/* Text Content */}
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.3em] text-red-700 dark:text-red-400">
          Something went wrong
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-tight text-gray-950 dark:text-white sm:text-5xl">
          We could not load this page
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-400 sm:text-lg">
          Please try again. If the problem continues, return home and start
          from a fresh route.
        </p>

        {/* Error Digest */}
        {error?.digest && (
          <p className="mt-4 text-xs font-semibold text-gray-500 dark:text-gray-500">
            Error reference: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

          <button
            type="button"
            onClick={() => retry?.()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700"
          >
            <FaRedoAlt aria-hidden="true" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-700 px-5 py-3 text-sm font-bold text-green-800 transition-all duration-200 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-slate-800"
          >
            <FaHome aria-hidden="true" />
            Back Home
          </Link>
        </div>
      </section>
    </main>
  )
} 