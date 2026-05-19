import { getCars } from '@/utils/utils';
import CarCard from './CarCard';

const AvailableCars = async () => {
    const allCars = await getCars();
    const availableCars = allCars.filter(
        (car) => car.dailyRentPrice > 200
    );

    if (availableCars.length === 0) {
        return (
            <div className="py-12 text-center bg-gray-50 rounded-2xl">
                <p className="text-gray-500">No available cars at the moment. Please check back later.</p>
            </div>
        );
    }

    return (
        <div className="py-10 px-4 bg-linear-to-br from-white to-gray-50">
            {/* Section header */}
            <div className="max-w-7xl mx-auto mb-12 text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    <span className="bg-linear-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                        Available Cars
                    </span>
                </h2>
                <div className="w-24 h-1 bg-green-600 mx-auto mt-4 rounded-full"></div>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                    Choose your perfect ride from our premium fleet
                </p>
            </div>

            {/* Cards grid */}
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {availableCars.map((car, index) => (
                        <CarCard key={index} car={car} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AvailableCars;