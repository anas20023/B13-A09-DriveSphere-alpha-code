'use client';

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

const CarCardActions = ({ car }) => {
    const router = useRouter()
    const handleViewDetails = () => {
        router.push(`/cars/${car._id}`)
    };
    return (
        <div className="flex gap-3 mt-auto pt-3">
            <Button
                onClick={handleViewDetails}
                className="flex-1 bg-green-650 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-750 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-300 shadow-md shadow-green-600/10 hover:shadow-lg hover:shadow-green-600/20 focus:ring-2 focus:ring-green-400 cursor-pointer"
            >
                View Details
            </Button>
        </div>
    );
};

export default CarCardActions;