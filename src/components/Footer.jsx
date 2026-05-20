'use client'

import React from 'react'
import Link from 'next/link'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    const footerLinks = [
        {
            title: 'Quick Links',
            items: [
                { href: '/', label: 'Home' },
                { href: '/cars', label: 'Explore Cars' },
                { href: '/cars/add', label: 'Add Car' },
                { href: '/bookings', label: 'My Bookings' },
            ],
        },
        {
            title: 'Support',
            items: [
                { href: '/contact', label: 'Contact Us' },
                { href: '/faq', label: 'FAQ' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
            ],
        },
        {
            title: 'Follow Us',
            social: [
                { platform: 'Twitter', href: '#' },
                { platform: 'Facebook', href: '#' },
                { platform: 'Instagram', href: '#' },
            ],
        },
    ]

    return (
        <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-400 border-t border-slate-200 dark:border-slate-900 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Top grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand column */}
                    <div>
                        <Link
                            href="/"
                            className="flex items-center gap-1.5 text-xl font-extrabold tracking-tight text-white mb-4"
                        >
                            <span className="text-green-400">Drive</span>
                            <span>Sphere</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-400 dark:text-slate-500">
                            Your trusted car rental platform. Explore, book, and hit the road in minutes.
                        </p>
                    </div>

                    {/* Dynamic link columns */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-white font-bold text-sm mb-4">{section.title}</h3>
                            {section.items ? (
                                <ul className="space-y-2.5">
                                    {section.items.map((item) => (
                                        <li key={item.label}>
                                            <Link
                                                href={item.href}
                                                className="text-sm text-slate-400 dark:text-slate-500 hover:text-green-400 dark:hover:text-green-400 transition-colors font-medium"
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : section.social ? (
                                <ul className="space-y-2.5">
                                    {section.social.map((social) => (
                                        <li key={social.platform}>
                                            <a
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-slate-400 dark:text-slate-500 hover:text-green-400 dark:hover:text-green-400 transition-colors font-medium"
                                            >
                                                {social.platform}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-slate-800 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500 dark:text-slate-600 font-medium">
                        &copy; {currentYear} DriveSphere. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-600 font-medium">
                        <Link href="/privacy" className="hover:text-green-400">
                            Privacy
                        </Link>
                        <Link href="/terms" className="hover:text-green-400">
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer