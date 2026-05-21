import CarBookingCard from '@/components/CarBookingCard'
import { getCarsByID } from '@/utils/utils'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'

const CarDetailsPage = async ({ params }) => {

    const { id } = await params
    const car = await getCarsByID(id)

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900 transition-colors duration-300 dark:bg-slate-900 dark:text-gray-100 sm:px-6 lg:px-8">

            <section className="mx-auto max-w-6xl">

                {/* Back Button */}
                <Link
                    href="/cars"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition-all duration-200 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                >
                    <FaArrowLeft className="text-xs" />
                    Back to Cars
                </Link>

                {/* Booking Card */}
                <div className="rounded-3xl border border-gray-200 bg-white p-2 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800">
                    <CarBookingCard car={car} />
                </div>

            </section>
        </main>
    )
}

export default CarDetailsPage