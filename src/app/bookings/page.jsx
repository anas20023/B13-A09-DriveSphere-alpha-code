import { getBookings } from '@/utils/utils'
import BookingsUI from '@/components/BookingsUI'

const BookingsPage = async () => {
  const bookings = await getBookings()
  return <BookingsUI bookings={bookings} />
}

export default BookingsPage
