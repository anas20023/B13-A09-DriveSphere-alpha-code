import CarBookingCard from '@/components/CarBookingCard'
import { getCarsByID } from '@/utils/utils'
import Link from 'next/link'
import {FaArrowLeft} from 'react-icons/fa'

const CarDetailsPage = async ({ params }) => {
    const { id } = await params
    const car = await getCarsByID(id)
    return (
        <main className="bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-6xl">
                <Link
                    href="/cars"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition hover:text-green-900"
                >
                    <FaArrowLeft />
                    Back to Cars
                </Link>
                <CarBookingCard car={car} />
            </section>
        </main>
    )
}

export default CarDetailsPage
