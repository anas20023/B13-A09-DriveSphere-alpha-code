'use client'

import { useEffect, useRef, useState } from 'react'
import { Avatar, Button } from '@heroui/react'
import Link from 'next/link'
import Image from 'next/image'
import { FaBars } from 'react-icons/fa'
import { FaX } from 'react-icons/fa6'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import NavLink from './NavLink'

export default function Navbar() {
    const router = useRouter()
    const { data: session } = authClient.useSession()
    const user = session?.user
    const desktopDropdownRef = useRef(null)
    const mobileDropdownRef = useRef(null)
    const navitems = [
        { href: '/', label: 'Home' },
        { href: '/cars', label: 'Explore Cars' },
        { href: '/cars/add', label: 'Add Car' },
        { href: '/bookings', label: 'My Bookings' },
    ]
    const profileItems = [
        { href: '/cars/add', label: 'Add Car' },
        { href: '/bookings', label: 'My Bookings' },
        { href: '/cars/my-added-cars', label: 'My Added Cars' },
    ]
    const [isOpen, setIsOpen] = useState(false)
    const [isAvatarOpen, setIsAvatarOpen] = useState(false)
    const [isMobileAvatarOpen, setIsMobileAvatarOpen] = useState(false)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target)) {
                setIsAvatarOpen(false)
            }

            if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)) {
                setIsMobileAvatarOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const onLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login");
                },
            },
        })
    }

    return (
        <nav className="sticky top-0 z-40 w-full bg-green-950 text-white shadow">
            <header className="flex h-16 items-center justify-between px-6 max-w-6xl mx-auto">
                {/* Logo – left */}
                <Link
                    href="/"
                    className="flex items-center gap-1 text-xl font-extrabold tracking-tight"
                >
                    <Image src={"https://i.ibb.co.com/sJPHjJW9/Chat-GPT-Image-May-18-2026-01-33-08-AM.png"} width={50} height={50} alt='Navbar Image' />
                    <span className="text-green-400">Drive</span>
                    <span>Sphere</span>
                </Link>

                {/* Desktop navigation – center */}
                <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
                    <ul className="flex items-center gap-6 text-sm font-medium">
                        {navitems.map((link) => (
                            <li key={link.href}>
                                <NavLink link={link.href}>{link.label}</NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Desktop auth – right */}
                <div ref={desktopDropdownRef} className="hidden md:flex items-center gap-3 relative">
                    {user ? (
                        <>
                            <button
                                type="button"
                                onClick={() => setIsAvatarOpen((open) => !open)}
                                className="text-sm font-medium text-gray-300 hover:text-white"
                                aria-haspopup="menu"
                                aria-expanded={isAvatarOpen}
                            >
                                <Avatar>
                                    <Avatar.Image alt="John Doe" src={user.image} />
                                    <Avatar.Fallback>JD</Avatar.Fallback>
                                </Avatar>
                            </button>
                            {isAvatarOpen && (
                                <div className="absolute right-0 top-14 z-50 w-56 rounded-lg border border-green-800 bg-green-950 p-3 shadow-lg">
                                    <ul className="flex flex-col gap-3 text-sm font-medium">
                                        {profileItems.map((link) => (
                                            <li key={link.href}>
                                                <Link
                                                    href={link.href}
                                                    onClick={() => setIsAvatarOpen(false)}
                                                    className="block text-gray-300 transition-colors hover:text-white"
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        color="danger"
                                        variant="solid"
                                        size="sm"
                                        onPress={() => {
                                            onLogout?.()
                                            setIsAvatarOpen(false)
                                        }}
                                        className="mt-4 w-full bg-red-600 hover:bg-red-700"
                                    >
                                        Sign Out
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-green-700 rounded hover:bg-green-800 text-white"
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile menu toggle */}
                <Button
                    className="md:hidden"
                    variant="light"
                    size="sm"
                    onPress={() => {
                        setIsOpen((open) => !open)
                        setIsMobileAvatarOpen(false)
                    }}
                    aria-label="Toggle menu"
                >
                    <span className="text-white cursor-pointer">{isOpen ? <FaX /> : <FaBars />}</span>
                </Button>
            </header>

            {/* Mobile menu */}
            {isOpen && (
                <div className="border-t border-green-800 bg-green-950 px-6 pb-6 pt-4 md:hidden">
                    <ul className="flex flex-col gap-4 text-sm font-medium">
                        {navitems.map((link) => (
                            <li key={link.href}>
                                <NavLink
                                    link={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="w-full justify-start"
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile auth */}
                    <div ref={mobileDropdownRef} className="mt-6 relative">
                        {user ? (
                            <div className="flex flex-col gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsMobileAvatarOpen((open) => !open)}
                                    className="flex items-center gap-3 text-sm font-medium text-gray-300 hover:text-white"
                                    aria-haspopup="menu"
                                    aria-expanded={isMobileAvatarOpen}
                                >
                                    <Avatar>
                                        <Avatar.Image alt="John Doe" src={user.image} />
                                        <Avatar.Fallback>JD</Avatar.Fallback>
                                    </Avatar>
                                </button>
                                {isMobileAvatarOpen && (
                                    <div className="rounded-lg border border-green-800 bg-green-950 p-3 shadow-lg">
                                        <ul className="flex flex-col gap-3 text-sm font-medium">
                                            {profileItems.map((link) => (
                                                <li key={link.href}>
                                                    <Link
                                                        href={link.href}
                                                        onClick={() => {
                                                            setIsOpen(false)
                                                            setIsMobileAvatarOpen(false)
                                                        }}
                                                        className="block text-gray-300 transition-colors hover:text-white"
                                                    >
                                                        {link.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                        <Button
                                            color="danger"
                                            variant="solid"
                                            size="sm"
                                            className="mt-4 w-full justify-center bg-red-600 hover:bg-red-700"
                                            onPress={() => {
                                                onLogout?.()
                                                setIsOpen(false)
                                                setIsMobileAvatarOpen(false)
                                            }}
                                        >
                                            Logout
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-center px-4 py-2 rounded bg-green-700 hover:bg-green-800 text-white"
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
