import { getCarsByUser } from '@/utils/utils'
import MyCarCard from '@/components/MyCarCard'
import Link from 'next/link'
import {
  FaCalendarCheck,
  FaCarSide,
  FaCheckCircle,
  FaPlus,
} from 'react-icons/fa'

const MyCarPage = async () => {
  const myCars = await getCarsByUser()
  const availableCars = myCars.filter(
    (car) => car.availabilityStatus === 'Available'
  ).length
  const totalBookings = myCars.reduce(
    (total, car) => total + Number(car.booked || 0),
    0
  )

  return (
    <main className="bg-gray-50">
      <section className="bg-green-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-green-300">
            My Cars
          </p>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Manage your DriveSphere fleet
            </h1>
            <p className="mt-5 text-base leading-7 text-gray-300 sm:text-lg">
              Keep your uploaded cars organized with pricing, availability,
              pickup details, and booking activity in one place.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <SummaryCard
              icon={<FaCarSide />}
              label="Total Cars"
              value={myCars.length}
            />
            <SummaryCard
              icon={<FaCheckCircle />}
              label="Available"
              value={availableCars}
            />
          </div>

          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Uploaded Cars
              </h2>
              <div className="mt-3 h-1 w-20 rounded-full bg-green-600" />
            </div>
            <Link
              href="/cars/add"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-green-600/20 transition hover:bg-green-700"
            >
              <FaPlus />
              Add Car
            </Link>
          </div>

          {myCars.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-green-200 bg-white px-6 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl text-green-700">
                <FaCarSide />
              </div>
              <h3 className="mt-5 text-xl font-bold text-gray-900">
                No cars uploaded yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-gray-500">
                Add your first rental car and it will appear in this dashboard.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
              {myCars.map((car) => (
                <MyCarCard key={car._id} car={car} />
              ))}
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

export default MyCarPage
