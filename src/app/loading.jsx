import { FaCarSide } from 'react-icons/fa'

export default function Loading() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-6xl">
        <div className="mb-10 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
            <FaCarSide className="animate-pulse text-xl" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-700">
              DriveSphere
            </p>
            <h1 className="mt-1 text-2xl font-black text-gray-950">
              Loading your next ride
            </h1>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm"
            >
              <div className="h-44 animate-pulse bg-gray-200" />
              <div className="space-y-4 p-5">
                <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
                <div className="h-11 w-full animate-pulse rounded-lg bg-green-100" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
