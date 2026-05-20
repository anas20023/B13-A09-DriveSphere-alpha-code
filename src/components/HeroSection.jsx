'use client'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Link from "next/link";

const HeroSection = ({ cars }) => {
    const heroImages = cars.length > 0 ? cars : [
        {
            _id: 'default-hero',
            carName: 'DriveSphere rental car',
            imageURL: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7',
        },
    ]

    return (
        <section className="relative w-full overflow-hidden">
            <Swiper
                className={'h-[88vh] min-h-140'}
                modules={[Autoplay]}
                autoplay={{ delay: 3200, disableOnInteraction: false }}
                loop={heroImages.length > 1}
            >
                {
                    heroImages.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div
                                className="h-full w-full bg-cover bg-center relative"
                                style={{ backgroundImage: `url(${item.imageURL})` }}
                            >
                                <div className="absolute inset-0 bg-black/55" />
                                <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
                            </div>
                        </SwiperSlide>
                    ))
                }

            </Swiper>

            <div className="pointer-events-none absolute inset-0 z-10 flex items-center px-4 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-6xl">
                    <div className="max-w-2xl text-white">
                        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-green-300">
                            DriveSphere
                        </p>
                        <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                            Rent the right car for every journey
                        </h1>
                        <p className="mt-5 max-w-xl text-base leading-7 text-gray-200 sm:text-lg">
                            Choose from comfortable, stylish, and reliable cars with
                            clear pricing and quick booking.
                        </p>
                        <Link
                            href="/cars"
                            className="pointer-events-auto mt-8 inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-950/30 transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300"
                        >
                            Explore Cars
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection
