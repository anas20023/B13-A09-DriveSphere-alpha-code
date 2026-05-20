'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  FaCalendarAlt,
  FaCarSide,
  FaClipboardList,
  FaDollarSign,
  FaPen,
  FaRegStickyNote,
  FaTrash,
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

const BookingsUI = ({ bookings }) => {
  const totalCost = bookings.reduce(
    (sum, booking) => sum + Number(booking.dailyRentPrice || 0),
    0
  )
  const driverRequests = bookings.filter(
    (booking) => booking.drived_needed === 'YES'
  ).length

  const handleUpdateBooking = (booking) => {
    console.log('Update booking:', booking)
    alert(`Update booking for ${booking.carName}`)
  }

  const handleDeleteBooking = (booking) => {
    console.log('Delete booking:', booking)
    alert(`Delete booking for ${booking.carName}`)
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
              value={bookings.length}
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

          {bookings.length === 0 ? (
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
              {bookings.map((booking) => {
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
                            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-white px-4 py-3 text-sm font-bold text-green-700 transition hover:border-green-600 hover:bg-green-50"
                          >
                            <FaPen />
                            Update
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBooking(booking)}
                            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-600 transition hover:border-red-500 hover:bg-red-50"
                          >
                            <FaTrash />
                            Delete
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
    </main>
  )
}

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

export default BookingsUI
