import React from 'react'
import { FaMapMarkerAlt, FaUserFriends } from 'react-icons/fa'
import CarCardActions from './CarCardActions'
import Image from 'next/image'

const CarCard = ({ car }) => {
    return (
        <div
            className="group bg-white dark:bg-slate-900 rounded-2xl shadow-md dark:shadow-slate-950/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-slate-100 dark:border-slate-800 flex flex-col h-full hover:border-green-500/20 dark:hover:border-green-400/20"
        >
            {/* Image section */}
            <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                    src={car.imageURL}
                    alt={car.carName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
                {/* Availability badge */}
                <div className="absolute top-3 left-3 bg-green-600 dark:bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    ✓ Available
                </div>
                {/* Price badge */}
                <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-green-700 dark:text-green-400 font-extrabold px-3 py-1 rounded-lg shadow-md text-sm border border-slate-100/50 dark:border-slate-800/50">
                    ${car.dailyRentPrice} / day
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col grow">
                <div className="mb-3">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {car.carName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="inline-block bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            {car.carType}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700 text-xs">•</span>
                        <span className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 font-medium">
                            <FaUserFriends className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                            {car.seatCapacity} seats
                        </span>
                    </div>
                </div>

                {/* Details with icons */}
                <div className="space-y-3.5 mb-4 mt-1 text-sm flex-1">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                        <FaMapMarkerAlt className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="capitalize">{car.pickupLocation.toLowerCase()}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-500 line-clamp-2 text-sm leading-relaxed">
                        {car.description}
                    </p>
                </div>

                {/* Interactive buttons (client component) */}
                <CarCardActions car={car} />
            </div>

            {/* Green accent line */}
            <div className="h-1.5 w-full bg-linear-to-r from-green-500 via-emerald-400 to-green-600"></div>
        </div>
    )
}

export default CarCard
