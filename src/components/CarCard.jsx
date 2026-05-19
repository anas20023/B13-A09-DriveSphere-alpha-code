import React from 'react'
import { FaMapMarkerAlt, FaUserFriends } from 'react-icons/fa'
import CarCardActions from './CarCardActions'
import Image from 'next/image'

const CarCard = ({ car }) => {
    return (
        <div
            className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 flex flex-col h-full"
        >
            {/* Image section */}
            <div className="relative h-56 overflow-hidden bg-gray-200">
                <Image
                    src={car.imageURL}
                    alt={car.carName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"></div>
                {/* Availability badge */}
                <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    ✓ Available
                </div>
                {/* Price badge */}
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-green-800 font-bold px-3 py-1 rounded-lg shadow-md text-sm">
                    ${car.dailyRentPrice} / day
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col grow">
                <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
                        {car.carName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {car.carType}
                        </span>
                        <span className="text-gray-400 text-xs">•</span>
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                            <FaUserFriends className="w-3.5 h-3.5 text-green-600" />
                            {car.seatCapacity} seats
                        </span>
                    </div>
                </div>

                {/* Details with icons */}
                <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                        <FaMapMarkerAlt className="w-4 h-4 text-green-600" />
                        <span className="capitalize">{car.pickupLocation.toLowerCase()}</span>
                    </div>
                    <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
                        {car.description}
                    </p>
                </div>

                {/* Interactive buttons (client component) */}
                <CarCardActions car={car} />
            </div>

            {/* Green accent line */}
            <div className="h-1.5 w-full bg-linear-to-r from-green-400 to-green-700"></div>
        </div>
    )
}

export default CarCard
