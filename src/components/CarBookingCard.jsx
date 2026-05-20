'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { authClient } from '@/lib/auth-client'
import {
    FaCalendarAlt,
    FaCalendarCheck,
    FaCarSide,
    FaCheckCircle,
    FaMapMarkerAlt,
    FaRegStickyNote,
    FaTimes,
    FaUserTie,
    FaUsers,
} from 'react-icons/fa'
import { FaBookmark } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'
const CarBookingCard = ({ car }) => {
    const router = useRouter()
    const { data: session } = authClient.useSession()
    const user = session?.user
    const [formData, setFormData] = useState({
        booking_date: '',
        drived_needed: 'NO',
        note: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

    useEffect(() => {
        if (!isBookingModalOpen) {
            return
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsBookingModalOpen(false)
            }
        }

        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isBookingModalOpen])

    const handleChange = (event) => {
        const { name, value } = event.target

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }))
    }

    const handleBooking = async (event) => {
        event.preventDefault()

        if (!formData.booking_date) {
            toast.error('Please select a booking date.')
            return
        }

        if (!user?.id) {
            toast.error('Please login before booking a car.')
            return
        }

        const bookingData = {
            carName: car.carName,
            dailyRentPrice: car.dailyRentPrice,
            carType: car.carType,
            imageURL: car.imageURL,
            booking_date: formData.booking_date,
            drived_needed: formData.drived_needed,
            note: formData.note.trim(),
            user_id: user.id,
            car_id: car._id,
        }

        setIsSubmitting(true)

        try {
            const { data: tokenData } = await authClient.token()
            // console.log(tokenData)
            const token = tokenData?.token

            if (!token) {
                throw new Error('Authentication token unavailable.')
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(bookingData)
            })

            const data = await res.json().catch(() => ({}))

            if (!res.ok) {
                throw new Error(data.message || 'Failed to Book the Car !')
            }

            toast.success(data.message || 'Successfully Booked the Car !')
            setIsBookingModalOpen(false)
            router.push('/cars')
        } catch (error) {
            console.log(error)
            toast.error(error.message || "Failed to Book the Car !")
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <>
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative min-h-64 overflow-hidden bg-gray-200 sm:min-h-88 lg:min-h-full">
                        <Image
                            src={car.imageURL}
                            alt={car.carName}
                            fill
                            priority
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-green-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                            <FaCheckCircle />
                            {car.availabilityStatus}
                        </span>
                    </div>

                    <div className="flex flex-col p-5 sm:p-6 lg:p-7">
                        <p className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                            <FaCarSide />
                            {car.carType}
                        </p>

                        <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-4xl">
                            {car.carName}
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
                            {car.description}
                        </p>

                        <div className="mt-5 grid grid-cols-3 gap-3">
                            <div className="rounded-xl bg-gray-50 p-3">
                                <p className="text-xs font-semibold uppercase text-gray-500">
                                    Rent
                                </p>
                                <p className="mt-1 text-xl font-black text-green-700">
                                    ${car.dailyRentPrice}
                                </p>
                                <p className="text-xs text-gray-500">per day</p>
                            </div>

                            <div className="rounded-xl bg-gray-50 p-3">
                                <p className="text-xs font-semibold uppercase text-gray-500">
                                    Seats
                                </p>
                                <p className="mt-1 flex items-center gap-2 text-lg font-black text-gray-900">
                                    <FaUsers className="text-green-600" />
                                    {car.seatCapacity}
                                </p>
                                <p className="text-xs text-gray-500">passengers</p>
                            </div>

                            <div className="rounded-xl bg-gray-50 p-3">
                                <p className="text-xs font-semibold uppercase text-gray-500">
                                    Pickup
                                </p>
                                <p className="mt-1 flex items-start gap-2 text-sm font-black text-gray-900 sm:text-base">
                                    <FaMapMarkerAlt className="shrink-0 text-green-600" />
                                    <span className="min-w-0 wrap-break-word leading-tight">{car.pickupLocation}</span>
                                </p>
                                <p className="text-xs text-gray-500">location</p>
                            </div>
                        </div>

                        <div className="mt-5 rounded-xl border border-green-100 bg-green-50 px-4 py-3">
                            <p className="text-sm font-bold text-green-800">
                                <FaBookmark size={16} className='inline-block mx-2' />  Booked by {car.booked}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsBookingModalOpen(true)}
                            className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200"
                        >
                            <FaCalendarCheck />
                            Book Now
                        </button>
                    </div>
                </div>
                <div className="h-1.5 bg-linear-to-r from-green-400 to-green-800" />
            </div>

            {isBookingModalOpen ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="booking-modal-title"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setIsBookingModalOpen(false)
                        }
                    }}
                >
                    <form
                        onSubmit={handleBooking}
                        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5 sm:p-6">
                            <div>
                                <p className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                                    <FaCarSide />
                                    {car.carType}
                                </p>
                                <h2 id="booking-modal-title" className="text-2xl font-black text-gray-900">
                                    Book {car.carName}
                                </h2>
                                <p className="mt-1 text-sm font-medium text-gray-500">
                                    ${car.dailyRentPrice} per day from {car.pickupLocation}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsBookingModalOpen(false)}
                                className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 focus:outline-none focus:ring-4 focus:ring-green-100"
                                aria-label="Close booking modal"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                            <label className="block">
                                <span className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                    <FaCalendarAlt className="text-green-600" />
                                    Booking Date
                                </span>
                                <input
                                    type="date"
                                    name="booking_date"
                                    value={formData.booking_date}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                    className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                                />
                            </label>

                            <div>
                                <p className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
                                    <FaUserTie className="text-green-600" />
                                    Driver Needed
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {['YES', 'NO'].map((option) => (
                                        <label
                                            key={option}
                                            className={`flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-bold transition ${formData.drived_needed === option
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

                            <label className="block sm:col-span-2">
                                <span className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                    <FaRegStickyNote className="text-green-600" />
                                    Note
                                </span>
                                <textarea
                                    name="note"
                                    value={formData.note}
                                    onChange={handleChange}
                                    placeholder="Write pickup time, destination, or any special request."
                                    rows={3}
                                    className="mt-2 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                                />
                            </label>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 p-5 sm:flex-row sm:justify-end sm:p-6">
                            <button
                                type="button"
                                onClick={() => setIsBookingModalOpen(false)}
                                disabled={isSubmitting}
                                className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <FaCalendarCheck />
                                {isSubmitting ? 'Booking...' : 'Book Now'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}
        </>
    )
}

export default CarBookingCard
