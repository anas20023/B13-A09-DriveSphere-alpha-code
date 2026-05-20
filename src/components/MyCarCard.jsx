'use client'

import Image from 'next/image'
import {
  FaCalendarCheck,
  FaCarSide,
  FaDollarSign,
  FaEdit,
  FaMapMarkerAlt,
  FaTrash,
  FaUsers,
} from 'react-icons/fa'

const MyCarCard = ({ car }) => {
  const isAvailable = car.availabilityStatus === 'Available'

  const handleUpdateCar = (selectedCar) => {
    console.log('Update car:', selectedCar)
    alert(`Update ${selectedCar.carName}`)
  }

  const handleDeleteCar = (selectedCar) => {
    console.log('Delete car:', selectedCar)
    alert(`Delete ${selectedCar.carName}`)
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-56 overflow-hidden bg-gray-200">
        <Image
          src={car.imageURL}
          alt={car.carName}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent" />
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold shadow-md ${
            isAvailable ? 'bg-green-600 text-white' : 'bg-red-100 text-red-700'
          }`}
        >
          {car.availabilityStatus}
        </span>
        <span className="absolute bottom-4 right-4 rounded-lg bg-white/95 px-3 py-1 text-sm font-extrabold text-green-800 shadow-md">
          ${car.dailyRentPrice} / day
        </span>
      </div>

      <div className="flex grow flex-col p-5">
        <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          <FaCarSide />
          {car.carType}
        </p>

        <h3 className="line-clamp-1 text-xl font-extrabold text-gray-900">
          {car.carName}
        </h3>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <InfoTile
            icon={<FaUsers />}
            label="Capacity"
            value={`${car.seatCapacity} seats`}
          />
          <InfoTile
            icon={<FaCalendarCheck />}
            label="Booked"
            value={car.booked}
          />
          <InfoTile
            icon={<FaMapMarkerAlt />}
            label="Pickup"
            value={car.pickupLocation}
          />
          <InfoTile
            icon={<FaDollarSign />}
            label="Rent"
            value={`$${car.dailyRentPrice}`}
          />
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
          {car.description}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleUpdateCar(car)}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-white px-4 py-3 text-sm font-bold text-green-700 transition hover:border-green-600 hover:bg-green-50"
          >
            <FaEdit />
            Update
          </button>
          <button
            type="button"
            onClick={() => handleDeleteCar(car)}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-600 transition hover:border-red-500 hover:bg-red-50"
          >
            <FaTrash />
            Delete
          </button>
        </div>
      </div>
      <div className="h-1.5 bg-linear-to-r from-green-400 to-green-800" />
    </article>
  )
}

const InfoTile = ({ icon, label, value }) => (
  <div className="rounded-xl bg-gray-50 p-3">
    <p className="flex items-center gap-2 font-semibold text-gray-900">
      <span className="shrink-0 text-green-600">{icon}</span>
      <span className="min-w-0 truncate">{value}</span>
    </p>
    <p className="mt-1 text-xs text-gray-500">{label}</p>
  </div>
)

export default MyCarCard
