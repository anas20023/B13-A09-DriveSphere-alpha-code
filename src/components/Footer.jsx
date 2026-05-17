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
        <footer className="bg-green-950 text-gray-300 border-t border-green-800">
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Top grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand column */}
                    <div>
                        <Link
                            href="/"
                            className="flex items-center gap-1 text-xl font-extrabold tracking-tight text-white mb-4"
                        >
                            <span className="text-green-400">Drive</span>
                            <span>Sphere</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Your trusted car rental platform. Explore, book, and hit the road in minutes.
                        </p>
                    </div>

                    {/* Dynamic link columns */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-white font-semibold mb-4">{section.title}</h3>
                            {section.items ? (
                                <ul className="space-y-2">
                                    {section.items.map((item) => (
                                        <li key={item.label}>
                                            <Link
                                                href={item.href}
                                                className="text-sm text-gray-400 hover:text-green-400 transition-colors"
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : section.social ? (
                                <ul className="space-y-2">
                                    {section.social.map((social) => (
                                        <li key={social.platform}>
                                            <a
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-gray-400 hover:text-green-400 transition-colors"
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
                <div className="mt-10 pt-6 border-t border-green-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        &copy; {currentYear} DriveSphere. All rights reserved.
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500">
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