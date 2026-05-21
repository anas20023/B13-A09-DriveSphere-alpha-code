import ExploreCarCard from '@/components/ExploreCarCard'
import { getCars } from '@/utils/utils'

const CarsPage = async ({ searchParams }) => {

  const params = await searchParams;
  const search = params?.search || '';
  const type = params?.type || ''

  const cars = await getCars(search, type)

  return (
    <main className="bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-slate-900 dark:text-gray-100">

      {/* Hero Section */}
      <section className="bg-green-950 px-4 py-16 text-white sm:px-6 lg:px-8 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-green-300 dark:text-green-400">
            Explore Cars
          </p>

          <div className="max-w-3xl">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Find the right ride for your next journey
            </h1>

            <p className="mt-5 text-base leading-7 text-gray-300 dark:text-gray-400 sm:text-lg">
              Browse DriveSphere&apos;s available fleet with pricing,
              seating, pickup location, and quick access to full vehicle details.
            </p>
          </div>
        </div>
      </section>

      {/* Cars Section */}
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          {/* Heading */}
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Available Fleet
              </h2>

              <div className="mt-3 h-1 w-20 rounded-full bg-green-600 dark:bg-green-500" />
            </div>

            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {cars.length} {cars.length === 1 ? 'car' : 'cars'} ready to rent
            </p>
          </div>

          {/* Empty State */}
          {cars.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-green-200 bg-white px-6 py-14 text-center shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800">

              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                No cars found
              </h3>

              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Try changing your search or filter options.
              </p>
            </div>
          ) : (
            <ExploreCarCard cars={cars} />
          )}
        </div>
      </section>
    </main>
  )
}

export default CarsPage