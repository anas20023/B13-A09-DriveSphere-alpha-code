'use client'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Link from "next/link";
import { motion } from "framer-motion";

const HeroSection = ({ cars }) => {
    const heroImages = cars.length > 0 ? cars : [
        {
            _id: 'default-hero',
            carName: 'DriveSphere rental car',
            imageURL: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7',
        },
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100, damping: 20 }
        }
    }

    return (
        <section className="relative w-full overflow-hidden">
            <Swiper
                className={'h-[88vh] min-h-140'}
                modules={[Autoplay]}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                loop={heroImages.length > 1}
            >
                {
                    heroImages.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div
                                className="h-full w-full bg-cover bg-center relative"
                                style={{ backgroundImage: `url(${item.imageURL})` }}
                            >
                                <div className="absolute inset-0 bg-black/60 dark:bg-black/75 transition-colors duration-300" />
                                <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
                            </div>
                        </SwiperSlide>
                    ))
                }

            </Swiper>

            <div className="pointer-events-none absolute inset-0 z-10 flex items-center px-4 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-6xl">
                    <motion.div 
                        className="max-w-2xl text-white"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.p 
                            variants={itemVariants}
                            className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-green-400 dark:text-green-300"
                        >
                            DriveSphere
                        </motion.p>
                        <motion.h1 
                            variants={itemVariants}
                            className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl tracking-tight"
                        >
                            Rent the right car for every journey
                        </motion.h1>
                        <motion.p 
                            variants={itemVariants}
                            className="mt-5 max-w-xl text-base leading-7 text-gray-200 dark:text-slate-400 sm:text-lg"
                        >
                            Choose from comfortable, stylish, and reliable cars with
                            clear pricing and quick booking.
                        </motion.p>
                        <motion.div variants={itemVariants}>
                            <Link
                                href="/cars"
                                className="pointer-events-auto mt-8 inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-950/30 transition-all duration-300 hover:bg-green-700 hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-green-300 cursor-pointer"
                            >
                                Explore Cars
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection
