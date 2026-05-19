import { getCars } from '@/utils/utils'
import Image from 'next/image'
import Link from 'next/link'
import { FaCarSide, FaMapMarkerAlt, FaUsers } from 'react-icons/fa'

const CarsPage = async () => {
  const cars = await getCars()

  return (
    <main className="bg-gray-50">
      <section className="bg-green-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-green-300">
            Explore Cars
          </p>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Find the right ride for your next journey
            </h1>
            <p className="mt-5 text-base leading-7 text-gray-300 sm:text-lg">
              Browse DriveSphere&apos;s available fleet with pricing, seating, pickup
              location, and quick access to full vehicle details.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Available Fleet
              </h2>
              <div className="mt-3 h-1 w-20 rounded-full bg-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-500">
              {cars.length} {cars.length === 1 ? 'car' : 'cars'} ready to rent
            </p>
          </div>

          {cars.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-green-200 bg-white px-6 py-14 text-center">
              <h3 className="text-xl font-bold text-gray-900">
                No cars available right now
              </h3>
              <p className="mt-2 text-gray-500">
                Please check back soon for new rental options.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
              {cars.map((car) => (
                <article
                  key={car._id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-200">
                    <Image
                      src={car.imageURL}
                      alt={car.carName}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                      Available
                    </span>
                    <span className="absolute bottom-4 right-4 rounded-lg bg-white/95 px-3 py-1 text-sm font-extrabold text-green-800 shadow-md">
                      ${car.dailyRentPrice} / day
                    </span>
                  </div>

                  <div className="flex grow flex-col p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="line-clamp-1 text-xl font-extrabold text-gray-900">
                          {car.carName}
                        </h3>
                        <p className="mt-1 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          <FaCarSide className="text-green-600" />
                          {car.carType}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl bg-gray-50 p-3">
                        <div className="flex items-center gap-2 font-semibold text-gray-900">
                          <FaUsers className="text-green-600" />
                          {car.seatCapacity} seats
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Capacity</p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-3">
                        <div className="flex items-center gap-2 font-semibold text-gray-900">
                          <FaMapMarkerAlt className="text-green-600" />
                          <span className="line-clamp-1">
                            {car.pickupLocation}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Pickup</p>
                      </div>
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-600">
                      {car.description}
                    </p>

                    <Link
                      href={`/cars/${car._id}`}
                      className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-green-600/20 transition hover:bg-green-700"
                    >
                      View Details
                    </Link>
                  </div>
                  <div className="h-1.5 bg-linear-to-r from-green-400 to-green-800" />
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default CarsPage
