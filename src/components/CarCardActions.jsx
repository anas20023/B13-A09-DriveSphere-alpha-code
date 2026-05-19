'use client';

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CarCardActions = ({ car }) => {
    // console.log(car)
    const router=useRouter()
    const handleViewDetails = () => {
        router.push(`/cars/${car._id}`)
    };

    const handleBookNow = () => {
        toast.success(`✨ You are booking the ${car.carName}. Our team will contact you shortly to confirm the reservation.`)
    };

    return (
        <div className="flex gap-3 mt-auto pt-3">
            <Button
                onClick={handleViewDetails}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] focus:ring-2 focus:ring-green-300"
            >
                View Details
            </Button>
            <Button
                onClick={handleBookNow}
                variant="outline"
                className="flex-1 border-2 border-green-600 text-green-700 hover:bg-green-50 font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 hover:shadow-md"
            >
                Book Now
            </Button>
        </div>
    );
};

export default CarCardActions;