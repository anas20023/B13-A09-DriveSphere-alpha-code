'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { AlertDialog, Button } from '@heroui/react'
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
import { FaX } from 'react-icons/fa6'

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
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div className="relative h-56 overflow-hidden bg-gray-200">
          <Image
            src={currentCar.imageURL}
            alt={currentCar.carName}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent" />
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold shadow-md ${isAvailable ? 'bg-green-600 text-white' : 'bg-red-100 text-red-700'
              }`}
          >
            {currentCar.availabilityStatus}
          </span>
          <span className="absolute bottom-4 right-4 rounded-lg bg-white/95 px-3 py-1 text-sm font-extrabold text-green-800 shadow-md">
            ${currentCar.dailyRentPrice} / day
          </span>
        </div>

        <div className="flex grow flex-col p-5">
          <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            <FaCarSide />
            {currentCar.carType}
          </p>

          <h3 className="line-clamp-1 text-xl font-extrabold text-gray-900">
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

          <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
            {currentCar.description}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleUpdateCar}
              disabled={isDeleting}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-green-200 bg-white px-4 py-3 text-sm font-bold text-green-700 transition hover:border-green-600 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaEdit />
              Update
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              disabled={isDeleting}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-600 transition hover:border-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaTrash />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
        <div className="h-1.5 bg-linear-to-r from-green-400 to-green-800" />
      </article>

      {isUpdateOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
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
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5 sm:p-6">
              <div>
                <p className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                  <FaCarSide />
                  Edit Car
                </p>
                <h2 id="car-update-title" className="text-2xl font-black text-gray-900">
                  Update {currentCar.carName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsUpdateOpen(false)}
                disabled={isUpdating}
                className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 focus:outline-none focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
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
                  className={inputClass}
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
                  className={inputClass}
                />
              </UpdateField>

              <UpdateField error={errors.carType} icon={<FaCarSide />} label="Car Type">
                <select
                  name="carType"
                  value={formData.carType}
                  onChange={handleChange}
                  required
                  className={`${inputClass} cursor-pointer`}
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
                  className={inputClass}
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
                  className={inputClass}
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
                  className={`${inputClass} cursor-pointer`}
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
                  className={inputClass}
                />
              </UpdateField>

              <UpdateField error={errors.imageURL} icon={<FaImage />} label="Image URL">
                <input
                  type="url"
                  name="imageURL"
                  value={formData.imageURL}
                  onChange={handleChange}
                  required
                  className={inputClass}
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
                    className={`${inputClass} resize-none leading-7`}
                  />
                </UpdateField>
              </div>

              <div className="sm:col-span-2">
                <div className="relative h-44 overflow-hidden rounded-xl bg-green-950 text-green-100">
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
                      <FaImage className="text-3xl" />
                      <span className="text-sm font-semibold">Image preview</span>
                    </div>
                  )}
                </div>
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
                {isUpdating ? 'Updating...' : 'Update Car'}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <AlertDialog isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container placement="center" size="md">
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Icon status="danger">
                  <FaTrash />
                </AlertDialog.Icon>
                <div>
                  <AlertDialog.Heading>Delete this car?</AlertDialog.Heading>
                  <p className="mt-1 text-sm font-medium text-gray-500">
                    This action cannot be undone.
                  </p>
                </div>
              </AlertDialog.Header>
              <AlertDialog.Body>
                <p className="text-sm leading-6 text-gray-600">
                  You are about to delete{' '}
                  <span className="font-bold text-gray-900">{currentCar.carName}</span>
                  . It will be removed from your DriveSphere fleet.
                </p>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <AlertDialog.CloseTrigger
                  isDisabled={isDeleting}
                  className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-4 focus:ring-red-100"
                  aria-label="Close delete confirmation modal"
                >
                  <FaTimes />
                </AlertDialog.CloseTrigger>
                <Button
                  onPress={handleDeleteCar}
                  isDisabled={isDeleting}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <FaTrash />
                  {isDeleting ? 'Deleting...' : 'Delete Car'}
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </>
  )
}

const inputClass =
  'mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100'

const InfoTile = ({ icon, label, value }) => (
  <div className="rounded-xl bg-gray-50 p-3">
    <p className="flex items-center gap-2 font-semibold text-gray-900">
      <span className="shrink-0 text-green-600">{icon}</span>
      <span className="min-w-0 truncate">{value}</span>
    </p>
    <p className="mt-1 text-xs text-gray-500">{label}</p>
  </div>
)

const UpdateField = ({ children, error, icon, label }) => (
  <label className="block">
    <span className="flex items-center gap-2 text-sm font-bold text-gray-800">
      <span className="text-green-600">{icon}</span>
      {label}
    </span>
    {children}
    {error ? <p className="mt-2 text-sm font-semibold text-red-600">{error}</p> : null}
  </label>
)

export default MyCarCard
