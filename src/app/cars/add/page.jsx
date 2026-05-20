'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import {
  FaCalendarCheck,
  FaCarSide,
  FaCheckCircle,
  FaClipboardList,
  FaDollarSign,
  FaImage,
  FaMapMarkerAlt,
  FaUsers,
} from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

const initialFormData = {
  carName: '',
  dailyRentPrice: '',
  carType: '',
  imageURL: '',
  seatCapacity: '',
  pickupLocation: '',
  description: '',
  availabilityStatus: '',
  booked: '',
}

const carTypes = ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Minivan', 'Luxury']
const availabilityOptions = ['Available', 'Unavailable']

const AddCar = () => {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const user=session?.user
  // console.log(user)
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const imagePreview = useMemo(() => {
    if (!/^https?:\/\/.+/i.test(formData.imageURL.trim())) {
      return null
    }

    return formData.imageURL.trim()
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

    if (
      formData.dailyRentPrice &&
      Number(formData.dailyRentPrice) <= 0
    ) {
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
      !/^https?:\/\/.+/i.test(formData.imageURL.trim())
    ) {
      nextErrors.imageURL = 'Enter a valid image URL.'
    }

    if (formData.description.trim().length > 0 && formData.description.trim().length < 20) {
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

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the highlighted fields.')
      return
    }

    setIsSubmitting(true)

    const newCar = {
      carName: formData.carName.trim(),
      dailyRentPrice: Number(formData.dailyRentPrice),
      carType: formData.carType,
      imageURL: formData.imageURL.trim(),
      seatCapacity: Number(formData.seatCapacity),
      pickupLocation: formData.pickupLocation.trim(),
      description: formData.description.trim(),
      availabilityStatus: formData.availabilityStatus,
      booked: Number(formData.booked),
      uploaded_by:user.id
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCar)
      })
      // console.log(res)
      toast.success(res.message || 'Car information is ready to add.')
      router.push('/cars')
    } catch (error) {
      console.log(error.message)
    }
    // console.log('New car payload:', newCar)
    // setFormData(initialFormData)
    setIsSubmitting(false)
  }

  const inputClass =
    'mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100'
  const labelClass = 'text-sm font-bold text-gray-800'
  const errorClass = 'mt-2 text-sm font-semibold text-red-600'

  return (
    <main className="bg-gray-50">
      <section className="bg-green-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-green-300">
            Add New Car
          </p>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Add a rental-ready vehicle to DriveSphere
            </h1>
            <p className="mt-5 text-base leading-7 text-gray-300 sm:text-lg">
              Fill in every vehicle detail, set the availability status, and keep
              your fleet information consistent for customers.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_360px]">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl"
          >
            <div className="border-b border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <FaClipboardList />
                </span>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">
                    Car Information
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    All fields are mandatory.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
              <Field
                error={errors.carName}
                icon={<FaCarSide />}
                label="Car Name"
                labelClass={labelClass}
                errorClass={errorClass}
              >
                <input
                  type="text"
                  name="carName"
                  value={formData.carName}
                  onChange={handleChange}
                  placeholder="Hyundai Tucson"
                  required
                  className={inputClass}
                />
              </Field>

              <Field
                error={errors.dailyRentPrice}
                icon={<FaDollarSign />}
                label="Daily Rent Price"
                labelClass={labelClass}
                errorClass={errorClass}
              >
                <input
                  type="number"
                  name="dailyRentPrice"
                  value={formData.dailyRentPrice}
                  onChange={handleChange}
                  placeholder="95"
                  min="1"
                  step="1"
                  required
                  className={inputClass}
                />
              </Field>

              <Field
                error={errors.carType}
                icon={<FaCarSide />}
                label="Car Type"
                labelClass={labelClass}
                errorClass={errorClass}
              >
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
              </Field>

              <Field
                error={errors.seatCapacity}
                icon={<FaUsers />}
                label="Seat Capacity"
                labelClass={labelClass}
                errorClass={errorClass}
              >
                <input
                  type="number"
                  name="seatCapacity"
                  value={formData.seatCapacity}
                  onChange={handleChange}
                  placeholder="5"
                  min="1"
                  step="1"
                  required
                  className={inputClass}
                />
              </Field>

              <Field
                error={errors.pickupLocation}
                icon={<FaMapMarkerAlt />}
                label="Pickup Location"
                labelClass={labelClass}
                errorClass={errorClass}
              >
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  placeholder="Khulna"
                  required
                  className={inputClass}
                />
              </Field>

              <Field
                error={errors.availabilityStatus}
                icon={<FaCheckCircle />}
                label="Availability Status"
                labelClass={labelClass}
                errorClass={errorClass}
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
              </Field>

              <Field
                error={errors.booked}
                icon={<FaCalendarCheck />}
                label="Booked Count"
                labelClass={labelClass}
                errorClass={errorClass}
              >
                <input
                  type="number"
                  name="booked"
                  value={formData.booked}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="1"
                  required
                  className={inputClass}
                />
              </Field>

              <Field
                error={errors.imageURL}
                icon={<FaImage />}
                label="Image URL"
                labelClass={labelClass}
                errorClass={errorClass}
              >
                <input
                  type="url"
                  name="imageURL"
                  value={formData.imageURL}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo-1567938637147-f2d28cf0478c"
                  required
                  className={inputClass}
                />
              </Field>

              <div className="sm:col-span-2">
                <Field
                  error={errors.description}
                  icon={<FaClipboardList />}
                  label="Description"
                  labelClass={labelClass}
                  errorClass={errorClass}
                >
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Modern SUV ideal for family trips and long drives."
                    rows={5}
                    required
                    className={`${inputClass} resize-none leading-7`}
                  />
                </Field>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="text-sm font-medium text-gray-500">
                Review every field before adding the car.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FaCheckCircle />
                {isSubmitting ? 'Adding Car...' : 'Add Car'}
              </button>
            </div>

            <div className="h-1.5 bg-linear-to-r from-green-400 to-green-800" />
          </form>

          <aside className="h-fit overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
            <div className="relative min-h-56 overflow-hidden bg-gray-200">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt={formData.carName || 'Car preview'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 360px"
                />
              ) : (
                <div className="flex h-56 flex-col items-center justify-center gap-3 bg-green-950 text-green-100">
                  <FaImage className="text-4xl" />
                  <p className="text-sm font-semibold">Image preview</p>
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                {formData.availabilityStatus || 'Status'}
              </span>
              <span className="absolute bottom-4 right-4 rounded-lg bg-white/95 px-3 py-1 text-sm font-extrabold text-green-800 shadow-md">
                ${formData.dailyRentPrice || '0'} / day
              </span>
            </div>

            <div className="p-5">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                <FaCarSide />
                {formData.carType || 'Car type'}
              </p>
              <h3 className="line-clamp-2 text-2xl font-black text-gray-900">
                {formData.carName || 'Car name'}
              </h3>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="flex items-center gap-2 font-semibold text-gray-900">
                    <FaUsers className="text-green-600" />
                    {formData.seatCapacity || '0'} seats
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Capacity</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="flex items-center gap-2 font-semibold text-gray-900">
                    <FaMapMarkerAlt className="text-green-600" />
                    <span className="line-clamp-1">
                      {formData.pickupLocation || 'Pickup'}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Location</p>
                </div>
              </div>

              <p className="mt-4 line-clamp-4 text-sm leading-6 text-gray-600">
                {formData.description ||
                  'A short vehicle description will appear here as you type.'}
              </p>
            </div>
            <div className="h-1.5 bg-linear-to-r from-green-400 to-green-800" />
          </aside>
        </div>
      </section>
    </main>
  )
}

const Field = ({ children, error, icon, label, labelClass, errorClass }) => (
  <label className="block">
    <span className={`${labelClass} flex items-center gap-2`}>
      <span className="text-green-600">{icon}</span>
      {label}
    </span>
    {children}
    {error ? <p className={errorClass}>{error}</p> : null}
  </label>
)

export default AddCar
