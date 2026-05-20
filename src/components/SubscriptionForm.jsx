'use client';

import { useState } from 'react';
import { Input, Button } from '@heroui/react';
import {
    FiMail,
    FiArrowRight,
    FiCheckCircle,
    FiStar,
} from 'react-icons/fi';
import AnimateIn from './AnimateIn';

const SubscriptionForm = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }

        alert(`Thanks for subscribing! We'll send updates to ${email}`);
        setEmail('');
    };

    return (
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 transition-colors duration-300">
            {/* Background Glow */}
            <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-emerald-400/10 dark:bg-emerald-500/5 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-green-300/10 dark:bg-green-500/5 blur-3xl" />

            <div className="relative mx-auto max-w-5xl">
                <AnimateIn variant="scaleIn">
                    <div className="overflow-hidden rounded-[32px] border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.3)]">
                        <div className="grid gap-0 lg:grid-cols-2">
                            {/* Left Content */}
                            <div className="flex flex-col justify-center p-8 sm:p-12">
                                <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 dark:bg-emerald-450/10 px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                                    <FiStar className="text-lg" />
                                    Weekly Travel Inspiration
                                </div>

                                <h2 className="text-3xl font-black leading-tight text-slate-900 dark:text-white sm:text-5xl">
                                    Stay updated with our latest journeys
                                </h2>

                                <p className="mt-5 text-base leading-relaxed text-slate-655 dark:text-slate-350 sm:text-lg">
                                    Get exclusive travel deals, destination guides,
                                    and premium offers directly in your inbox.
                                </p>

                                <div className="mt-8 space-y-4">
                                    {[
                                        'Exclusive discounts & offers',
                                        'Travel tips from experts',
                                        'Early access to new destinations',
                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                                                <FiCheckCircle />
                                            </div>

                                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Form */}
                            <div className="relative flex items-center bg-linear-to-br from-emerald-600 to-green-600 dark:from-emerald-800 dark:to-green-700 p-8 sm:p-12">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

                                <div className="relative w-full rounded-[28px] border border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/25 p-6 backdrop-blur-xl sm:p-8 shadow-inner">
                                    <h3 className="text-2xl font-bold text-white">
                                        Join Our Newsletter
                                    </h3>

                                    <p className="mt-2 text-sm leading-relaxed text-white/80 dark:text-white/70">
                                        Subscribe now and receive curated travel
                                        inspiration every week.
                                    </p>

                                    <form
                                        onSubmit={handleSubmit}
                                        className="mt-8 space-y-5"
                                    >
                                        <div className="relative">
                                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />

                                            <input
                                                type="email"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="h-14 w-full rounded-2xl border border-white/20 dark:border-white/10 bg-white/15 dark:bg-black/30 pl-12 pr-4 text-white placeholder:text-white/60 outline-none backdrop-blur-md transition focus:border-white focus:ring-2 focus:ring-white/10"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            radius="lg"
                                            size="lg"
                                            className="group h-14 w-full bg-white hover:bg-slate-50 text-emerald-700 font-bold transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                                            endContent={
                                                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                                            }
                                        >
                                            Subscribe Now
                                        </Button>
                                    </form>

                                    <p className="mt-5 text-center text-xs text-white/70 dark:text-white/60">
                                        No spam. Unsubscribe anytime.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimateIn>
            </div>
        </section>
    );
};

export default SubscriptionForm;