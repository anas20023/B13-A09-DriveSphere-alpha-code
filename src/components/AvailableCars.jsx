import { getCars } from '@/utils/utils';
import CarCard from './CarCard';
import AnimateIn from './AnimateIn';

const AvailableCars = async () => {
    const allCars = await getCars();
    const availableCars = allCars.filter(
        (car) => car.dailyRentPrice > 200
    );

    if (availableCars.length === 0) {
        return (
            <div className="py-12 text-center bg-gray-50 dark:bg-slate-900 rounded-2xl">
                <p className="text-gray-500 dark:text-gray-400">No available cars at the moment. Please check back later.</p>
            </div>
        );
    }

    return (
        <div className="py-16 px-4 bg-linear-to-br from-white to-gray-50 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
            {/* Section header */}
            <div className="max-w-7xl mx-auto mb-12 text-center">
                <AnimateIn variant="slideDown">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        <span className="bg-linear-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300 bg-clip-text text-transparent">
                            Available Cars
                        </span>
                    </h2>
                    <div className="w-24 h-1.5 bg-green-500 dark:bg-green-400 mx-auto mt-4 rounded-full"></div>
                    <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                        Choose your perfect ride from our premium fleet
                    </p>
                </AnimateIn>
            </div>

            {/* Cards grid */}
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {availableCars.map((car, index) => (
                        <AnimateIn key={index} variant="slideUp" delay={index * 0.1}>
                            <CarCard car={car} />
                        </AnimateIn>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AvailableCars;