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
            router.push('/bookings')
        } catch (error) {
            console.log(error)
            toast.error(error.message || "Failed to Book the Car !")
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <>
            <div className="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg dark:shadow-slate-950/50">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative min-h-64 overflow-hidden bg-slate-150 dark:bg-slate-800 sm:min-h-88 lg:min-h-full">
                        <Image
                            src={car.imageURL}
                            alt={car.carName}
                            fill
                            priority
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
                        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-green-600 dark:bg-green-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                            <FaCheckCircle />
                            {car.availabilityStatus}
                        </span>
                    </div>

                    <div className="flex flex-col p-5 sm:p-6 lg:p-7 justify-between">
                        <div>
                            <p className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-green-50 dark:bg-green-950/40 px-3 py-1.5 text-xs font-bold text-green-700 dark:text-green-300">
                                <FaCarSide />
                                {car.carType}
                            </p>

                            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                                {car.carName}
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
                                {car.description}
                            </p>

                            <div className="mt-5 grid grid-cols-3 gap-3">
                                <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3">
                                    <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-450">
                                        Rent
                                    </p>
                                    <p className="mt-1 text-xl font-black text-green-700 dark:text-green-455">
                                        ${car.dailyRentPrice}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-450">per day</p>
                                </div>

                                <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3">
                                    <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-455">
                                        Seats
                                    </p>
                                    <p className="mt-1 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
                                        <FaUsers className="text-green-600 dark:text-green-400" />
                                        {car.seatCapacity}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-450">passengers</p>
                                </div>

                                <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3">
                                    <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-455">
                                        Pickup
                                    </p>
                                    <p className="mt-1 flex items-start gap-2 text-sm font-black text-slate-900 dark:text-white sm:text-base">
                                        <FaMapMarkerAlt className="shrink-0 text-green-600 dark:text-green-400" />
                                        <span className="min-w-0 wrap-break-word leading-tight capitalize">{car.pickupLocation.toLowerCase()}</span>
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-450">location</p>
                                </div>
                            </div>

                            <div className="mt-5 rounded-xl border border-green-105 dark:border-green-900/60 bg-green-50 dark:bg-green-950/30 px-4 py-3">
                                <p className="text-sm font-bold text-green-800 dark:text-green-300">
                                    <FaBookmark size={16} className='inline-block mx-2 text-green-600 dark:text-green-400' />  Booked by {car.booked}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsBookingModalOpen(true)}
                            className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-600 dark:bg-green-600 hover:bg-green-700 dark:hover:bg-green-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/25 transition duration-300 focus:outline-none"
                        >
                            <FaCalendarCheck />
                            Book Now
                        </button>
                    </div>
                </div>
                <div className="h-1.5 bg-linear-to-r from-green-500 via-emerald-400 to-green-600" />
            </div>

            {isBookingModalOpen ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 py-6"
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
                        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 p-5 sm:p-6">
                            <div>
                                <p className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-green-50 dark:bg-green-950/40 px-3 py-1 text-xs font-bold text-green-700 dark:text-green-300">
                                    <FaCarSide />
                                    {car.carType}
                                </p>
                                <h2 id="booking-modal-title" className="text-2xl font-black text-slate-900 dark:text-white">
                                    Book {car.carName}
                                </h2>
                                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                    ${car.dailyRentPrice} per day from {car.pickupLocation}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsBookingModalOpen(false)}
                                className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 transition hover:border-green-200 dark:hover:border-green-900 hover:bg-green-50 dark:hover:bg-green-950/30 hover:text-green-700 dark:hover:text-green-400 focus:outline-none"
                                aria-label="Close booking modal"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                            <label className="block">
                                <span className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-250">
                                    <FaCalendarAlt className="text-green-600 dark:text-green-400" />
                                    Booking Date
                                </span>
                                <input
                                    type="date"
                                    name="booking_date"
                                    value={formData.booking_date}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                    className="mt-2 w-full rounded-lg border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-green-105 dark:focus:ring-green-950/40"
                                />
                            </label>

                            <div>
                                <p className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-250">
                                    <FaUserTie className="text-green-600 dark:text-green-455" />
                                    Driver Needed
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {['YES', 'NO'].map((option) => (
                                        <label
                                            key={option}
                                            className={`flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-bold transition ${formData.drived_needed === option
                                                ? 'border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 ring-4 ring-green-100 dark:ring-green-950/40'
                                                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-green-200 dark:hover:border-green-900/60'
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
                                <span className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-250">
                                    <FaRegStickyNote className="text-green-600 dark:text-green-400" />
                                    Note
                                </span>
                                <textarea
                                    name="note"
                                    value={formData.note}
                                    onChange={handleChange}
                                    placeholder="Write pickup time, destination, or any special request."
                                    rows={3}
                                    className="mt-2 w-full resize-none rounded-lg border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-green-100 dark:focus:ring-green-950/40"
                                />
                            </label>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-5 sm:flex-row sm:justify-end sm:p-6">
                            <button
                                type="button"
                                onClick={() => setIsBookingModalOpen(false)}
                                disabled={isSubmitting}
                                className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-350 hover:border-slate-350 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600 dark:bg-green-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
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
