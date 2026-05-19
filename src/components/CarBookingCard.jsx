'use client'
import Image from 'next/image'
import toast from 'react-hot-toast'
import {
    FaCalendarCheck,
    FaCarSide,
    FaCheckCircle,
    FaMapMarkerAlt,
    FaUsers,
} from 'react-icons/fa'
import { FaBookmark } from 'react-icons/fa6'
const CarBookingCard = ({ car }) => {
    const handleBooking=()=>{
        toast.success("Car Booking Will Work")
    }
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative min-h-80 overflow-hidden bg-gray-200 sm:min-h-115">
                    <Image
                        src={car.imageURL}
                        alt={car.carName}
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                    <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white shadow-lg">
                        <FaCheckCircle />
                        {car.availabilityStatus}
                    </span>
                </div>

                <div className="flex flex-col p-6 sm:p-8 lg:p-10">
                    <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                        <FaCarSide />
                        {car.carType}
                    </p>

                    <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-5xl">
                        {car.carName}
                    </h1>

                    <p className="mt-5 text-base leading-7 text-gray-600">
                        {car.description}
                    </p>

                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl bg-gray-50 p-4">
                            <p className="text-xs font-semibold uppercase text-gray-500">
                                Rent
                            </p>
                            <p className="mt-2 text-2xl font-black text-green-700">
                                ${car.dailyRentPrice}
                            </p>
                            <p className="text-sm text-gray-500">per day</p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4">
                            <p className="text-xs font-semibold uppercase text-gray-500">
                                Seats
                            </p>
                            <p className="mt-2 flex items-center gap-2 text-xl font-black text-gray-900">
                                <FaUsers className="text-green-600" />
                                {car.seatCapacity}
                            </p>
                            <p className="text-sm text-gray-500">passengers</p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4">
                            <p className="text-xs font-semibold uppercase text-gray-500">
                                Pickup
                            </p>
                            <p className="mt-2 flex items-center gap-2 text-xl font-black text-gray-900">
                                <FaMapMarkerAlt className="text-green-600" />
                                {car.pickupLocation}
                            </p>
                            <p className="text-sm text-gray-500">location</p>
                        </div>
                    </div>

                    <div className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-5">
                        <p className="text-sm font-bold text-green-800">
                            <FaBookmark size={16} className='inline-block mx-2' />  Booked by {car.booked}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={()=>handleBooking()}
                        className="mt-8 cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-4 text-base font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200"
                    >
                        <FaCalendarCheck />
                        Book Now
                    </button>
                </div>
            </div>
            <div className="h-1.5 bg-linear-to-r from-green-400 to-green-800" />
        </div>
    )
}

export default CarBookingCard
