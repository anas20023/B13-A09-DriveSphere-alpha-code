'use client'
import { useState } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { authClient } from '@/lib/auth-client'
import {
    FaCalendarCheck,
    FaCarSide,
    FaCheckCircle,
    FaMapMarkerAlt,
    FaRegStickyNote,
    FaUserTie,
    FaUsers,
} from 'react-icons/fa'
import { FaBookmark } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'
const CarBookingCard = ({ car }) => {
    const router=useRouter()
    const { data: session } = authClient.useSession()
    const user = session?.user
    const [formData, setFormData] = useState({
        drived_needed: 'NO',
        note: '',
    })

    const handleChange = (event) => {
        const { name, value } = event.target

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }))
    }

    const handleBooking = async (event) => {
        event.preventDefault()

        const bookingData = {
            carName: car.carName,
            dailyRentPrice: car.dailyRentPrice,
            carType: car.carType,
            imageURL: car.imageURL,
            drived_needed: formData.drived_needed,
            note: formData.note.trim(),
            user_id: user?.id || '',
            car_id: car._id,
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(bookingData)
            })
            toast.success(res.message || 'Successfully Booked the Car !')
            router.push('/cars')
        } catch (error) {
            console.log(error)
            toast.error(error.message || "Failed to Book the Car !")
        }
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
                            <p className="mt-2 flex items-start gap-2 text-xl font-black text-gray-900">
                                <FaMapMarkerAlt className="text-green-600" />
                                <span className="leading-tight wrap-break-word">{car.pickupLocation}</span>
                            </p>
                            <p className="text-sm text-gray-500">location</p>
                        </div>
                    </div>

                    <div className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-5">
                        <p className="text-sm font-bold text-green-800">
                            <FaBookmark size={16} className='inline-block mx-2' />  Booked by {car.booked}
                        </p>
                    </div>

                    <form onSubmit={handleBooking} className="mt-8 space-y-5">
                        <div>
                            <p className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800">
                                <FaUserTie className="text-green-600" />
                                Driver Needed
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {['YES', 'NO'].map((option) => (
                                    <label
                                        key={option}
                                        className={`flex cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-sm font-bold transition ${formData.drived_needed === option
                                                ? 'border-green-600 bg-green-50 text-green-700 ring-4 ring-green-100'
                                                : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-green-200'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="drived_needed"
                                            value={option}
                                            checked={formData.drived_needed === option}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <label className="block">
                            <span className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                <FaRegStickyNote className="text-green-600" />
                                Note
                            </span>
                            <textarea
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                placeholder="Write pickup time, destination, or any special request."
                                rows={4}
                                className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                            />
                        </label>

                        <button
                            type="submit"
                            className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-4 text-base font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200"
                        >
                            <FaCalendarCheck />
                            Book Now
                        </button>
                    </form>
                </div>
            </div>
            <div className="h-1.5 bg-linear-to-r from-green-400 to-green-800" />
        </div>
    )
}

export default CarBookingCard
