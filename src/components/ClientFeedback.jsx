'use client';

import Marquee from 'react-fast-marquee';
import {
    FaStar,
    FaQuoteLeft,
    FaArrowRight,
} from 'react-icons/fa';
import { Avatar, Button } from '@heroui/react';

const ClientFeedback = () => {
    const feedbacks = [
        {
            id: 1,
            name: 'Sarah Johnson',
            role: 'Business Executive',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/women/44.jpg',
            text: 'Amazing service! The car was spotless and the booking experience felt premium from start to finish.',
        },
        {
            id: 2,
            name: 'Michael Chen',
            role: 'Entrepreneur',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
            text: 'Absolutely the best rental platform I’ve used. Fast support and luxury cars in perfect condition.',
        },
        {
            id: 3,
            name: 'Emily Davis',
            role: 'Travel Blogger',
            rating: 4,
            image: 'https://randomuser.me/api/portraits/women/68.jpg',
            text: 'Great car collection and smooth booking system. The staff was extremely friendly and professional.',
        },
        {
            id: 4,
            name: 'David Wilson',
            role: 'Software Engineer',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/men/75.jpg',
            text: 'Loved driving the Tesla Model S. Pickup and drop-off were incredibly easy and hassle-free.',
        },
        {
            id: 5,
            name: 'Lisa Brown',
            role: 'Fashion Designer',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/women/21.jpg',
            text: 'Highly recommended for luxury rentals. Everything felt elegant, modern, and trustworthy.',
        },
    ];

    return (
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
            {/* Background Glow */}
            <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-green-400/20 blur-3xl" />

            <div className="relative mx-auto max-w-7xl">
                {/* Heading */}
                <div className="mx-auto mb-14 max-w-3xl text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-700">
                        <FaStar className="text-xs" />
                        Trusted by Thousands
                    </div>

                    <h2 className="text-3xl font-black text-gray-900 sm:text-5xl">
                        What Our Clients Say
                    </h2>

                    <p className="mt-5 text-base leading-relaxed text-gray-600 sm:text-lg">
                        Real experiences from our happy customers who enjoyed
                        seamless luxury car rentals with premium support.
                    </p>
                </div>

                {/* Marquee */}
                <div className="relative">
                    <Marquee
                        pauseOnHover
                        speed={45}
                        gradient={false}
                    >
                        <div className="flex py-4">
                            {feedbacks.map((fb) => (
                                <div
                                    key={fb.id}
                                    className="group relative mr-6 w-[320px] overflow-hidden rounded-[28px] border border-white/40 bg-white/70 p-6 shadow-[0_10px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(16,185,129,0.18)]"
                                >
                                    {/* Quote Icon */}
                                    <div className="absolute right-5 top-5 text-4xl text-emerald-100 transition duration-300 group-hover:scale-110 group-hover:text-emerald-200">
                                        <FaQuoteLeft />
                                    </div>

                                    {/* User */}
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <Avatar.Image alt="John Doe" src={fb.image} />
                                            <Avatar.Fallback>JD</Avatar.Fallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-bold text-gray-900">
                                                {fb.name}
                                            </h4>

                                            <p className="text-sm text-gray-500">
                                                {fb.role}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="mt-5 flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar
                                                key={i}
                                                className={`text-sm ${i < fb.rating
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Feedback */}
                                    <p className="mt-5 text-sm leading-relaxed text-gray-600">
                                        “{fb.text}”
                                    </p>

                                    {/* Bottom */}
                                    <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                                        <span className="text-xs font-medium text-emerald-600">
                                            Verified Customer
                                        </span>

                                        <Button
                                            isIconOnly
                                            radius="full"
                                            size="sm"
                                            className="bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                        >
                                            <FaArrowRight className="text-xs" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Marquee>
                </div>
            </div>
        </section>
    );
};

export default ClientFeedback;