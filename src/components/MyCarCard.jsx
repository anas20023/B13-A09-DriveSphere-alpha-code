'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
// removed AlertDialog, Button as they are not used
import { authClient } from '@/lib/auth-client'
import {
  FaCalendarCheck,
  FaCarSide,
  FaCheckCircle,
  FaClipboardList,
  FaDollarSign,
  FaEdit,
  FaImage,
  FaMapMarkerAlt,
  FaTrash,
  FaTimes,
  FaUsers,
} from 'react-icons/fa'

const carTypes = ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Minivan', 'Luxury']
const availabilityOptions = ['Available', 'Unavailable']

const getEditableCarData = (car) => ({
  carName: car.carName || '',
  dailyRentPrice: car.dailyRentPrice ?? '',
  carType: car.carType || '',
  imageURL: car.imageURL || '',
  seatCapacity: car.seatCapacity ?? '',
  pickupLocation: car.pickupLocation || '',
  description: car.description || '',
  availabilityStatus: car.availabilityStatus || '',
  booked: car.booked ?? '',
})

const getAuthToken = async () => {
  const { data: tokenData } = await authClient.token()
  const token = tokenData?.token

  if (!token) {
    throw new Error('Authentication token unavailable.')
  }

  return token
}

const MyCarCard = ({ car }) => {
  const router = useRouter()
  const [currentCar, setCurrentCar] = useState(car)
  const [formData, setFormData] = useState(() => getEditableCarData(car))
  const [errors, setErrors] = useState({})
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)

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

  const isAvailable = currentCar.availabilityStatus === 'Available'

  const imagePreview = useMemo(() => {
    if (!/^https?:\/\/.+/i.test(formData.imageURL.toString().trim())) {
      return null
    }

    return formData.imageURL.toString().trim()
  }, [formData.imageURL])

  const validateForm = () => {
    const nextErrors = {}
    const requiredFields = [
      'carName',
      'dailyRentPrice',
      'carType',
      'imageURL',
      'seatCapacity',
      'pickupLocation',
      'description',
      'availabilityStatus',
      'booked',
    ]

    requiredFields.forEach((field) => {
      if (!formData[field].toString().trim()) {
        nextErrors[field] = 'This field is required.'
      }
    })

    if (formData.dailyRentPrice && Number(formData.dailyRentPrice) <= 0) {
      nextErrors.dailyRentPrice = 'Daily rent price must be greater than 0.'
    }

    if (
      formData.seatCapacity &&
      (!Number.isInteger(Number(formData.seatCapacity)) ||
        Number(formData.seatCapacity) < 1)
    ) {
      nextErrors.seatCapacity = 'Seat capacity must be at least 1.'
    }

    if (
      formData.booked &&
      (!Number.isInteger(Number(formData.booked)) || Number(formData.booked) < 0)
    ) {
      nextErrors.booked = 'Booked count cannot be negative.'
    }

    if (
      formData.imageURL &&
      !/^https?:\/\/.+/i.test(formData.imageURL.toString().trim())
    ) {
      nextErrors.imageURL = 'Enter a valid image URL.'
    }

    if (
      formData.description.trim().length > 0 &&
      formData.description.trim().length < 20
    ) {
      nextErrors.description = 'Description must be at least 20 characters.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
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

  const handleUpdateCar = () => {
    setFormData(getEditableCarData(currentCar))
    setErrors({})
    setIsUpdateOpen(true)
  }

  const handleUpdateSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the highlighted fields.')
      return
    }

    const updatedCar = {
      carName: formData.carName.trim(),
      dailyRentPrice: Number(formData.dailyRentPrice),
      carType: formData.carType,
      imageURL: formData.imageURL.trim(),
      seatCapacity: Number(formData.seatCapacity),
      pickupLocation: formData.pickupLocation.trim(),
      description: formData.description.trim(),
      availabilityStatus: formData.availabilityStatus,
      booked: Number(formData.booked),
      uploaded_by: currentCar.uploaded_by,
    }

    setIsUpdating(true)

    try {
      const token = await getAuthToken()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cars/${currentCar._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedCar),
        }
      )
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.message || 'Failed to Update the Car')
      }

      setCurrentCar((oldCar) => ({ ...oldCar, ...updatedCar }))
      toast.success(data.message || 'Car information updated successfully.')
      setIsUpdateOpen(false)
      router.refresh()
    } catch (error) {
      console.log(error.message)
      toast.error(error.message || 'Failed to Update the Car')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteCar = async () => {
    setIsDeleting(true)

    try {
      const token = await getAuthToken()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cars/${currentCar._id}`,
        {
          method: 'DELETE',
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.message || 'Failed to Delete the Car')
      }

      toast.success(data.message || 'Car deleted successfully.')
      setIsDeleteOpen(false)
      setIsDeleted(true)
      router.refresh()
    } catch (error) {
      console.log(error.message)
      toast.error(error.message || 'Failed to Delete the Car')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isDeleted) {
    return null
  }

  return (
    <>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg dark:shadow-slate-950/50 transition duration-305 hover:-translate-y-1 hover:shadow-2xl hover:border-green-500/10 dark:hover:border-green-400/10">
        <div className="relative h-56 overflow-hidden bg-slate-150 dark:bg-slate-800">
          <Image
            src={currentCar.imageURL}
            alt={currentCar.carName}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent" />
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold shadow-md ${isAvailable ? 'bg-green-600 text-white' : 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200/20'
              }`}
          >
            {currentCar.availabilityStatus}
          </span>
          <span className="absolute bottom-4 right-4 rounded-lg bg-white/95 dark:bg-slate-950/95 border border-slate-100/30 dark:border-slate-800/30 px-3 py-1 text-sm font-extrabold text-green-800 dark:text-green-400 shadow-md">
            ${currentCar.dailyRentPrice} / day
          </span>
        </div>

        <div className="flex grow flex-col p-5">
          <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-green-50 dark:bg-green-950/40 px-3 py-1 text-xs font-bold text-green-700 dark:text-green-300">
            <FaCarSide />
            {currentCar.carType}
          </p>

          <h3 className="line-clamp-1 text-xl font-bold text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
            {currentCar.carName}
          </h3>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <InfoTile
              icon={<FaUsers />}
              label="Capacity"
              value={`${currentCar.seatCapacity} seats`}
            />
            <InfoTile
              icon={<FaCalendarCheck />}
              label="Booked"
              value={currentCar.booked}
            />
            <InfoTile
              icon={<FaMapMarkerAlt />}
              label="Pickup"
              value={currentCar.pickupLocation}
            />
            <InfoTile
              icon={<FaDollarSign />}
              label="Rent"
              value={`$${currentCar.dailyRentPrice}`}
            />
          </div>

          <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {currentCar.description}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleUpdateCar}
              disabled={isDeleting}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-green-200 dark:border-green-850 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-bold text-green-750 dark:text-green-400 transition hover:border-green-600 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaEdit />
              Update
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              disabled={isDeleting}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 dark:border-red-900/60 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400 transition hover:border-red-500 dark:hover:border-red-450 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaTrash />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
        <div className="h-1.5 bg-linear-to-r from-green-500 via-emerald-400 to-green-600" />
      </article>

      {isUpdateOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="car-update-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsUpdateOpen(false)
            }
          }}
        >
          <form
            onSubmit={handleUpdateSubmit}
            noValidate
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-150 dark:border-slate-800 p-5 sm:p-6">
              <div>
                <p className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-green-50 dark:bg-green-950/40 px-3 py-1 text-xs font-bold text-green-700 dark:text-green-300">
                  <FaCarSide />
                  Edit Car
                </p>
                <h2 id="car-update-title" className="text-2xl font-black text-slate-900 dark:text-white">
                  Update {currentCar.carName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsUpdateOpen(false)}
                disabled={isUpdating}
                className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 text-slate-505 dark:text-slate-400 transition hover:border-green-200 dark:hover:border-green-900 hover:bg-green-50 dark:hover:bg-green-950/40 hover:text-green-700 dark:hover:text-green-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Close update modal"
              >
                <FaTimes />
              </button>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <UpdateField error={errors.carName} icon={<FaCarSide />} label="Car Name">
                <input
                  type="text"
                  name="carName"
                  value={formData.carName}
                  onChange={handleChange}
                  required
                  className={getInputClass('carName')}
                />
              </UpdateField>

              <UpdateField
                error={errors.dailyRentPrice}
                icon={<FaDollarSign />}
                label="Daily Rent Price"
              >
                <input
                  type="number"
                  name="dailyRentPrice"
                  value={formData.dailyRentPrice}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  required
                  className={getInputClass('dailyRentPrice')}
                />
              </UpdateField>

              <UpdateField error={errors.carType} icon={<FaCarSide />} label="Car Type">
                <select
                  name="carType"
                  value={formData.carType}
                  onChange={handleChange}
                  required
                  className={`${getInputClass('carType')} cursor-pointer`}
                >
                  <option value="">Select car type</option>
                  {carTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </UpdateField>

              <UpdateField
                error={errors.seatCapacity}
                icon={<FaUsers />}
                label="Seat Capacity"
              >
                <input
                  type="number"
                  name="seatCapacity"
                  value={formData.seatCapacity}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  required
                  className={getInputClass('seatCapacity')}
                />
              </UpdateField>

              <UpdateField
                error={errors.pickupLocation}
                icon={<FaMapMarkerAlt />}
                label="Pickup Location"
              >
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  required
                  className={getInputClass('pickupLocation')}
                />
              </UpdateField>

              <UpdateField
                error={errors.availabilityStatus}
                icon={<FaCheckCircle />}
                label="Availability Status"
              >
                <select
                  name="availabilityStatus"
                  value={formData.availabilityStatus}
                  onChange={handleChange}
                  required
                  className={`${getInputClass('availabilityStatus')} cursor-pointer`}
                >
                  <option value="">Select status</option>
                  {availabilityOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </UpdateField>

              <UpdateField
                error={errors.booked}
                icon={<FaCalendarCheck />}
                label="Booked Count"
              >
                <input
                  type="number"
                  name="booked"
                  value={formData.booked}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  required
                  className={getInputClass('booked')}
                />
              </UpdateField>

              <UpdateField error={errors.imageURL} icon={<FaImage />} label="Image URL">
                <input
                  type="url"
                  name="imageURL"
                  value={formData.imageURL}
                  onChange={handleChange}
                  required
                  className={getInputClass('imageURL')}
                />
              </UpdateField>

              <div className="sm:col-span-2">
                <UpdateField
                  error={errors.description}
                  icon={<FaClipboardList />}
                  label="Description"
                >
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                    className={`${getInputClass('description')} resize-none leading-7`}
                  />
                </UpdateField>
              </div>

              <div className="sm:col-span-2">
                <div className="relative h-44 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-500 dark:text-slate-400">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt={formData.carName || 'Car preview'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 768px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center gap-3">
                      <FaImage className="text-3xl text-green-600 dark:text-green-400" />
                      <span className="text-sm font-semibold">Image preview</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-5 sm:flex-row sm:justify-end sm:p-6">
              <button
                type="button"
                onClick={() => setIsUpdateOpen(false)}
                disabled={isUpdating}
                className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-350 hover:border-slate-350 dark:hover:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600 dark:bg-green-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-600/25 transition hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FaCheckCircle />
                {isUpdating ? 'Updating...' : 'Update Car'}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {isDeleteOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="car-delete-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsDeleteOpen(false)
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
                <FaTrash className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 id="car-delete-title" className="text-xl font-black text-slate-900 dark:text-white">Delete this car?</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                You are about to delete{' '}
                <span className="font-bold text-slate-900 dark:text-white">{currentCar.carName}</span>
                . It will be removed from your DriveSphere fleet.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeleting}
                className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-350 hover:border-slate-350 dark:hover:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCar}
                disabled={isDeleting}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 dark:bg-red-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FaTrash className="text-xs" />
                {isDeleting ? 'Deleting...' : 'Delete Car'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

const inputClass =
  'mt-2 w-full rounded-lg border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-green-105 dark:focus:ring-green-950/40'

const getInputClass = () => inputClass

const InfoTile = ({ icon, label, value }) => (
  <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3">
    <p className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
      <span className="shrink-0 text-green-600 dark:text-green-400">{icon}</span>
      <span className="min-w-0 truncate">{value}</span>
    </p>
    <p className="mt-1 text-xs text-slate-500 dark:text-slate-450">{label}</p>
  </div>
)

const UpdateField = ({ children, error, icon, label }) => (
  <label className="block">
    <span className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-250">
      <span className="text-green-600 dark:text-green-400">{icon}</span>
      {label}
    </span>
    {children}
    {error ? <p className="mt-2 text-sm font-semibold text-red-600 dark:text-red-400">{error}</p> : null}
  </label>
)

export default MyCarCard
