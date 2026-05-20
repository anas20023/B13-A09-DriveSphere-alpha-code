'use client';

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
const CarCardActions = ({ car }) => {
    // console.log(car)
    const router=useRouter()
    const handleViewDetails = () => {
        router.push(`/cars/${car._id}`)
    };
    return (
        <div className="flex gap-3 mt-auto pt-3">
            <Button
                onClick={handleViewDetails}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] focus:ring-2 focus:ring-green-300"
            >
                View Details
            </Button>
        </div>
    );
};

export default CarCardActions;