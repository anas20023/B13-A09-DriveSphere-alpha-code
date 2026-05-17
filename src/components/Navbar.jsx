'use client'

import { useState } from 'react'
import { Button } from '@heroui/react'
import Link from 'next/link'

export default function Navbar({ user, onLogout }) {
    const navitems = [
        { href: '/', label: 'Home' },
        { href: '/cars', label: 'Explore Cars' },
        { href: '/cars/add', label: 'Add Car' },
        { href: '/bookings', label: 'My Bookings' },
    ]
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-40 w-full bg-green-950 text-white shadow">
            <header className="flex h-16 items-center justify-between px-6 max-w-6xl mx-auto">
                {/* Logo – left */}
                <Link
                    href="/"
                    className="flex items-center gap-1 text-xl font-extrabold tracking-tight"
                >
                    <span className="text-green-400">Drive</span>
                    <span>Sphere</span>
                </Link>

                {/* Desktop navigation – center */}
                <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
                    <ul className="flex items-center gap-6 text-sm font-medium">
                        {navitems.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="relative inline-block text-gray-300 transition-colors hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-green-400 after:transition-all hover:after:w-full"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Desktop auth – right */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <>
                            <Link
                                href="/profile"
                                className="text-sm font-medium text-gray-300 hover:text-white"
                            >
                                {user.name}
                            </Link>
                            <Button
                                color="danger"
                                variant="solid"
                                size="sm"
                                onPress={onLogout}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Log Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-300 rounded hover:text-white"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-green-700 rounded hover:bg-green-800 text-white"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile menu toggle */}
                <Button
                    className="md:hidden"
                    variant="light"
                    size="sm"
                    onPress={() => setIsOpen((open) => !open)}
                    aria-label="Toggle menu"
                >
                    <span className="text-white">{isOpen ? '✕' : '☰'}</span>
                </Button>
            </header>

            {/* Mobile menu */}
            {isOpen && (
                <div className="border-t border-green-800 bg-green-950 px-6 pb-6 pt-4 md:hidden">
                    <ul className="flex flex-col gap-4 text-sm font-medium">
                        {navitems.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block text-gray-300 transition-colors hover:text-white"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile auth */}
                    <div className="mt-6">
                        {user ? (
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className="text-sm font-medium text-gray-300 hover:text-white"
                                >
                                    Profile
                                </Link>
                                <Button
                                    color="danger"
                                    variant="solid"
                                    size="sm"
                                    className="w-full justify-center bg-red-600 hover:bg-red-700"
                                    onPress={() => {
                                        onLogout?.()
                                        setIsOpen(false)
                                    }}
                                >
                                    Log Out
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-center px-4 py-2 border rounded text-gray-300 hover:text-white"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-center px-4 py-2 rounded bg-green-700 hover:bg-green-800 text-white"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}