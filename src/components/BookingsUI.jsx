'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authClient } from '@/lib/auth-client'
import {
  FaCalendarAlt,
  FaCarSide,
  FaCheckCircle,
  FaClipboardList,
  FaDollarSign,
  FaExclamationTriangle,
  FaPen,
  FaRegStickyNote,
  FaTrash,
  FaTimes,
  FaUserTie,
} from 'react-icons/fa'

const formatDate = (date) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))

const getBookingStatus = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const bookingDate = new Date(date)
  bookingDate.setHours(0, 0, 0, 0)

  if (bookingDate < today) {
    return {
      label: 'Completed',
      className: 'bg-gray-100 text-gray-700',
    }
  }

  if (bookingDate.getTime() === today.getTime()) {
    return {
      label: 'Today',
      className: 'bg-amber-100 text-amber-800',
    }
  }

  return {
    label: 'Upcoming',
    className: 'bg-green-100 text-green-800',
  }
}

const toDateInputValue = (date) => {
  if (!date) {
    return ''
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  return parsedDate.toISOString().split('T')[0]
}

const getEditableBookingData = (booking) => ({
  booking_date: toDateInputValue(booking.booking_date),
  drived_needed: booking.drived_needed || 'NO',
  note: booking.note || '',
})

const getAuthToken = async () => {
  const { data: tokenData } = await authClient.token()
  const token = tokenData?.token

  if (!token) {
    throw new Error('Authentication token unavailable.')
  }

  return token
}

const BookingsUI = ({ bookings }) => {
  const router = useRouter()
  const [bookingList, setBookingList] = useState(bookings)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [formData, setFormData] = useState({
    booking_date: '',
    drived_needed: 'NO',
    note: '',
  })
  const [errors, setErrors] = useState({})
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState(null)

  useEffect(() => {
    if (!isUpdateOpen) {
      return
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsUpdateOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isUpdateOpen])

  useEffect(() => {
    if (!isDeleteOpen) {
      return
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsDeleteOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDeleteOpen])

  const totalCost = bookingList.reduce(
    (sum, booking) => sum + Number(booking.dailyRentPrice || 0),
    0
  )
  const driverRequests = bookingList.filter(
    (booking) => booking.drived_needed === 'YES'
  ).length

  const handleUpdateBooking = (booking) => {
    setSelectedBooking(booking)
    setFormData(getEditableBookingData(booking))
    setErrors({})
    setIsUpdateOpen(true)
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }))
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!formData.booking_date) {
      nextErrors.booking_date = 'Please select a booking date.'
    }

    if (!['YES', 'NO'].includes(formData.drived_needed)) {
      nextErrors.drived_needed = 'Please choose a driver option.'
    }

    if (formData.note.trim().length > 250) {
      nextErrors.note = 'Note must be 250 characters or less.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleUpdateSubmit = async (event) => {
    event.preventDefault()

    if (!selectedBooking) {
      toast.error('No booking selected.')
      return
    }

    if (!validateForm()) {
      toast.error('Please fix the highlighted fields.')
      return
    }

    const updatedBooking = {
      booking_date: formData.booking_date,
      drived_needed: formData.drived_needed,
      note: formData.note.trim(),
    }

    setIsUpdating(true)

    try {
      const token = await getAuthToken()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/${selectedBooking._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedBooking),
        }
      )
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.message || 'Failed to Update the Booking')
      }

      setBookingList((currentBookings) =>
        currentBookings.map((booking) =>
          booking._id === selectedBooking._id
            ? { ...booking, ...updatedBooking }
            : booking
        )
      )
      toast.success(data.message || 'Booking updated successfully.')
      setIsUpdateOpen(false)
      setSelectedBooking(null)
      router.refresh()
    } catch (error) {
      console.log(error.message)
      toast.error(error.message || 'Failed to Update the Booking')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteBooking = (booking) => {
    setBookingToDelete(booking)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!bookingToDelete) return

    setDeletingId(bookingToDelete._id)
    setIsDeleteOpen(false)

    try {
      const token = await getAuthToken()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/${bookingToDelete._id}`,
        {
          method: 'DELETE',
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.message || 'Failed to Delete the Booking')
      }

      setBookingList((currentBookings) =>
        currentBookings.filter((currentBooking) => currentBooking._id !== bookingToDelete._id)
      )
      toast.success(data.message || 'Booking deleted successfully.')
      router.refresh()
    } catch (error) {
      console.log(error.message)
      toast.error(error.message || 'Failed to Delete the Booking')
    } finally {
      setDeletingId(null)
      setBookingToDelete(null)
    }
  }

  return (
    <main className="bg-gray-50">
      <section className="bg-green-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-green-300">
            My Bookings
          </p>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Track every DriveSphere reservation
            </h1>
            <p className="mt-5 text-base leading-7 text-gray-300 sm:text-lg">
              Review booked cars, rental dates, driver requests, and notes from
              your reservation history.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <SummaryCard
              icon={<FaClipboardList />}
              label="Total Bookings"
              value={bookingList.length}
            />
            <SummaryCard
              icon={<FaDollarSign />}
              label="Daily Rent Total"
              value={`$${totalCost}`}
            />
            <SummaryCard
              icon={<FaUserTie />}
              label="Driver Requests"
              value={driverRequests}
            />
          </div>

          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Reserved Cars
              </h2>
              <div className="mt-3 h-1 w-20 rounded-full bg-green-600" />
            </div>
            <Link
              href="/cars"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-green-600/20 transition hover:bg-green-700"
            >
              <FaCarSide />
              Browse Cars
            </Link>
          </div>

          {bookingList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-green-200 bg-white px-6 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl text-green-700">
                <FaCalendarAlt />
              </div>
              <h3 className="mt-5 text-xl font-bold text-gray-900">
                No bookings yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-gray-500">
                Choose a car from the fleet and your reservation details will
                appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
              {bookingList.map((booking) => {
                const status = getBookingStatus(booking.booking_date)

                return (
                  <article
                    key={booking._id}
                    className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div className="grid min-h-full grid-cols-1 md:grid-cols-[220px_1fr]">
                      <div className="relative min-h-56 overflow-hidden bg-gray-200 md:min-h-full">
                        <Image
                          src={booking.imageURL}
                          alt={booking.carName}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 220px"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/5 to-transparent" />
                        <span
                          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold shadow-md ${status.className}`}
                        >
                          {status.label}
                        </span>
                        <span className="absolute bottom-4 right-4 rounded-lg bg-white/95 px-3 py-1 text-sm font-extrabold text-green-800 shadow-md">
                          ${booking.dailyRentPrice} / day
                        </span>
                      </div>

                      <div className="flex flex-col p-5">
                        <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          <FaCarSide />
                          {booking.carType}
                        </p>

                        <h3 className="line-clamp-2 text-2xl font-black text-gray-900">
                          {booking.carName}
                        </h3>

                        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                          <InfoTile
                            icon={<FaCalendarAlt />}
                            label="Booking Date"
                            value={formatDate(booking.booking_date)}
                          />
                          <InfoTile
                            icon={<FaUserTie />}
                            label="Driver Needed"
                            value={booking.drived_needed}
                          />
                        </div>

                        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                          <p className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900">
                            <FaRegStickyNote className="text-green-600" />
                            Booking Note
                          </p>
                          <p className="line-clamp-3 text-sm leading-6 text-gray-600">
                            {booking.note || 'No note added for this booking.'}
                          </p>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handleUpdateBooking(booking)}
                            disabled={deletingId === booking._id}
                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-green-200 bg-white px-4 py-3 text-sm font-bold text-green-700 transition hover:border-green-600 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <FaPen />
                            Update
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBooking(booking)}
                            disabled={deletingId === booking._id}
                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-600 transition hover:border-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <FaTrash />
                            {deletingId === booking._id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="h-1.5 bg-linear-to-r from-green-400 to-green-800" />
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Update Modal */}
      {isUpdateOpen && selectedBooking ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-update-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsUpdateOpen(false)
            }
          }}
        >
          <form
            onSubmit={handleUpdateSubmit}
            noValidate
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5 sm:p-6">
              <div>
                <p className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                  <FaCarSide />
                  {selectedBooking.carType}
                </p>
                <h2 id="booking-update-title" className="text-2xl font-black text-gray-900">
                  Update {selectedBooking.carName}
                </h2>
                <p className="mt-1 text-sm font-medium text-gray-500">
                  ${selectedBooking.dailyRentPrice} per day
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsUpdateOpen(false)}
                disabled={isUpdating}
                className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 focus:outline-none focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Close booking update modal"
              >
                <FaTimes />
              </button>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <BookingField
                error={errors.booking_date}
                icon={<FaCalendarAlt />}
                label="Booking Date"
              >
                <input
                  type="date"
                  name="booking_date"
                  value={formData.booking_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className={inputClass}
                />
              </BookingField>

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
                {errors.drived_needed ? (
                  <p className="mt-2 text-sm font-semibold text-red-600">
                    {errors.drived_needed}
                  </p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <BookingField
                  error={errors.note}
                  icon={<FaRegStickyNote />}
                  label="Booking Note"
                >
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Write pickup time, destination, or any special request."
                    rows={4}
                    className={`${inputClass} resize-none leading-6`}
                  />
                </BookingField>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 p-5 sm:flex-row sm:justify-end sm:p-6">
              <button
                type="button"
                onClick={() => setIsUpdateOpen(false)}
                disabled={isUpdating}
                className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FaCheckCircle />
                {isUpdating ? 'Updating...' : 'Update Booking'}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && bookingToDelete ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-delete-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsDeleteOpen(false)
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 p-5 sm:p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-lg text-red-600">
                <FaExclamationTriangle />
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-4 focus:ring-red-100"
                aria-label="Close delete confirmation modal"
              >
                <FaTimes />
              </button>
            </div>

            <div className="px-5 pb-2 sm:px-6">
              <h2 id="booking-delete-title" className="text-xl font-black text-gray-900">
                Delete this booking?
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                You&apos;re about to delete your reservation for{' '}
                <span className="font-bold text-gray-800">{bookingToDelete.carName}</span>.
                This action cannot be undone.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 bg-gray-50 p-5 sm:flex-row sm:justify-end sm:p-6">
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
              >
                <FaTrash />
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

const inputClass =
  'mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100'

const SummaryCard = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-xl text-green-700">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-500">{label}</p>
        <p className="mt-1 text-2xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  </div>
)

const InfoTile = ({ icon, label, value }) => (
  <div className="rounded-xl bg-gray-50 p-3">
    <p className="flex items-center gap-2 font-semibold text-gray-900">
      <span className="text-green-600">{icon}</span>
      <span className="line-clamp-1">{value}</span>
    </p>
    <p className="mt-1 text-xs text-gray-500">{label}</p>
  </div>
)

const BookingField = ({ children, error, icon, label }) => (
  <label className="block">
    <span className="flex items-center gap-2 text-sm font-bold text-gray-800">
      <span className="text-green-600">{icon}</span>
      {label}
    </span>
    {children}
    {error ? <p className="mt-2 text-sm font-semibold text-red-600">{error}</p> : null}
  </label>
)

export default BookingsUI