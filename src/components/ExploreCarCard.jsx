'use client'

import Image from "next/image"
import Link from "next/link"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { FaCarSide, FaMapMarkerAlt, FaSearch, FaUsers } from "react-icons/fa"
import { FaSliders } from "react-icons/fa6"
const ExploreCarCard = ({ cars }) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const currentType = searchParams.get('type') || ''
    const currentSearch = searchParams.get('search') || ''

    // ✅ Derive unique types from actual data
    const carTypes = [...new Set(cars.map((car) => car.carType).filter(Boolean))].sort()

    const handleFilter = (value) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set('type', value)
        } else {
            params.delete('type')
        }
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <section className="w-full">
            {/* Search + Filter Bar */}
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">

                {/* Search Form */}
                <form
                    action=""
                    method="GET"
                    className="flex flex-1 items-center overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800 shadow-sm focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition"
                >
                    <span className="pl-4 text-gray-400">
                        <FaSearch size={14} />
                    </span>

                    <input
                        type="text"
                        name="search"
                        defaultValue={currentSearch}
                        placeholder="Search by car name..."
                        className="w-full px-3 py-3 text-sm outline-none placeholder:text-gray-400 dark:bg-gray-800 dark:text-gray-200"
                    />

                    {currentType && (
                        <input type="hidden" name="type" value={currentType} />
                    )}

                    <button
                        type="submit"
                        className="m-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 active:scale-95"
                    >
                        Search
                    </button>
                </form>

                {/* Filter Dropdown */}
                <div className="relative flex items-center">
                    <span className="pointer-events-none absolute left-3 text-gray-400">
                        <FaSliders size={13} />
                    </span>

                    <select
                        value={currentType}
                        onChange={(e) => handleFilter(e.target.value)}
                        className="appearance-none rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 py-3 pl-9 pr-8 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm outline-none transition hover:border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 cursor-pointer"
                    >
                        <option value="">All Types</option>
                        {carTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Active filter pill */}
            {(currentType || currentSearch) && (
                <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Showing results</span>
                    {currentSearch && (
                        <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 font-medium text-gray-700 dark:text-gray-200">
                            &quot;{currentSearch}&quot;
                        </span>
                    )}
                    {currentType && (
                        <span className="rounded-full bg-green-50 dark:bg-green-900 px-3 py-1 font-medium text-green-700 dark:text-green-200">
                            {currentType}
                        </span>
                    )}
                    <button
                        onClick={() => router.push(pathname)}
                        className="ml-1 text-xs text-red-500 underline underline-offset-2 hover:text-red-700"
                    >
                        Clear filters
                    </button>
                </div>
            )}

            {/* Empty State */}
            {cars.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-20 text-center">
                    <FaCarSide size={40} className="mb-4 text-gray-300" />
                    <p className="text-lg font-semibold text-gray-500">No cars found</p>
                    <p className="mt-1 text-sm text-gray-400">Try adjusting your search or filters.</p>
                    <button
                        onClick={() => router.push(pathname)}
                        className="mt-5 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                    >
                        Reset
                    </button>
                </div>
            )}

            {/* Cars Grid */}
            {cars.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {cars.map((car) => (
                        <article
                            key={car._id}
                            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            {/* Image */}
                            <div className="relative h-52 overflow-hidden bg-gray-100">
                                <Image
                                    src={car.imageURL}
                                    alt={car.carName}
                                    fill
                                    className="object-cover transition duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                />

                                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/5 to-transparent" />

                                <span className="absolute left-3 top-3 rounded-full bg-green-500 px-2.5 py-1 text-xs font-bold text-white shadow">
                                    Available
                                </span>

                                <span className="absolute bottom-3 right-3 rounded-lg bg-white/95 px-3 py-1 text-sm font-extrabold text-green-800 shadow">
                                    ${car.dailyRentPrice}
                                    <span className="ml-0.5 text-xs font-medium text-gray-500">/ day</span>
                                </span>
                            </div>

                            {/* Body */}
                            <div className="flex grow flex-col p-5">
                                {/* Title + Type */}
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="line-clamp-1 text-lg font-bold text-gray-900">
                                            {car.carName}
                                        </h3>

                                        <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-green-200">
                                            <FaCarSide size={10} />
                                            {car.carType}
                                        </span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="mt-4 grid grid-cols-2 gap-2.5 text-sm">
                                    <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5">
                                        <FaUsers className="shrink-0 text-green-500" size={13} />
                                        <div>
                                            <p className="font-semibold text-gray-800">{car.seatCapacity} seats</p>
                                            <p className="text-xs text-gray-400">Capacity</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5">
                                        <FaMapMarkerAlt className="shrink-0 text-green-500" size={13} />
                                        <div>
                                            <p className="line-clamp-1 font-semibold text-gray-800">{car.pickupLocation}</p>
                                            <p className="text-xs text-gray-400">Pickup</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-gray-500">
                                    {car.description}
                                </p>

                                {/* CTA */}
                                <Link
                                    href={`/cars/${car._id}`}
                                    className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 active:scale-95"
                                >
                                    View Details
                                </Link>
                            </div>

                            {/* Bottom accent bar */}
                            <div className="h-1 bg-linear-to-r from-green-400 to-green-700" />
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}

export default ExploreCarCard