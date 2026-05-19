'use client'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Button } from "@heroui/react";

const HeroSection = ({ cars }) => {

    return (
        <div className="w-full">
            <Swiper
                className={'h-screen'}
                modules={[Autoplay]}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                loop={true}
            >
                {
                    cars.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div
                                className="h-full w-full bg-cover bg-center relative"
                                style={{ backgroundImage: `url(${item.imageURL})` }}
                            >
                                <div className="absolute inset-0 bg-black/45" />
                                <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 text-white">
                                    <h2 className="text-3xl md:text-5xl font-bold mb-3">{item.carName}</h2>
                                    <p className="text-lg md:text-xl mb-6">Pickup Location: {item.pickupLocation}</p>
                                    <div className="flex gap-3">
                                        <Button variant="primary" className={'bg-green-600'}>
                                            Explore Now
                                        </Button>
                                        <Button variant="outline" className={'text-white border-green'}>
                                            Book Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))
                }

            </Swiper>
        </div>
    );
}

export default HeroSection