'use client'

import { useEffect, useRef, useState } from 'react'
import { Avatar, Button } from '@heroui/react'
import Link from 'next/link'
import Image from 'next/image'
import { FaBars } from 'react-icons/fa'
import { FaX } from 'react-icons/fa6'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import NavLink from './NavLink'

export default function Navbar() {
    const router = useRouter()
    const { data: session } = authClient.useSession()
    const user = session?.user
    const desktopDropdownRef = useRef(null)
    const mobileDropdownRef = useRef(null)

    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    const navitems = [
        { href: '/', label: 'Home' },
        { href: '/cars', label: 'Explore Cars' },
        { href: '/cars/add', label: 'Add Car' },
        { href: '/bookings', label: 'My Bookings' },
    ]
    const profileItems = [
        { href: '/cars/add', label: 'Add Car' },
        { href: '/bookings', label: 'My Bookings' },
        { href: '/cars/mycars', label: 'My Cars' },
    ]
    const [isOpen, setIsOpen] = useState(false)
    const [isAvatarOpen, setIsAvatarOpen] = useState(false)
    const [isMobileAvatarOpen, setIsMobileAvatarOpen] = useState(false)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)
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
        <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/85 backdrop-blur-md text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-900 shadow-sm transition-all duration-300">
            <header className="flex h-16 items-center justify-between px-6 max-w-6xl mx-auto">
                {/* Logo – left */}
                <Link
                    href="/"
                    className="flex items-center gap-2 text-xl font-extrabold tracking-tight"
                >
                    <Image src={"https://i.ibb.co.com/sJPHjJW9/Chat-GPT-Image-May-18-2026-01-33-08-AM.png"} width={40} height={40} alt='Navbar Image' />
                    <span className="text-green-600 dark:text-green-400">Drive</span>
                    <span className="text-slate-800 dark:text-slate-100">Sphere</span>
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

                {/* Theme Switcher & Desktop auth – right */}
                <div className="hidden md:flex items-center gap-4">
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200 cursor-pointer"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
                            ) : (
                                <Moon className="w-4 h-4 text-indigo-500" />
                            )}
                        </button>
                    )}

                    <div ref={desktopDropdownRef} className="relative">
                        {user ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setIsAvatarOpen((open) => !open)}
                                    className="flex items-center focus:outline-none cursor-pointer"
                                    aria-haspopup="menu"
                                    aria-expanded={isAvatarOpen}
                                >
                                    <Avatar>
                                        <Avatar.Image alt={user.name} src={user.image} />
                                        <Avatar.Fallback>{user.name.toLocaleUpperCase().slice(0,2)}</Avatar.Fallback>
                                    </Avatar>
                                </button>
                                {isAvatarOpen && (
                                    <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-250">
                                        <div className="mb-3 px-1">
                                            <p className="text-xs text-slate-400">Signed in as</p>
                                            <p className="text-sm font-bold truncate text-slate-850 dark:text-slate-200">{user.name}</p>
                                        </div>
                                        <hr className="border-slate-100 dark:border-slate-800 my-2" />
                                        <ul className="flex flex-col gap-2.5 text-sm font-medium">
                                            {profileItems.map((link) => (
                                                <li key={link.href}>
                                                    <Link
                                                        href={link.href}
                                                        onClick={() => setIsAvatarOpen(false)}
                                                        className="block text-slate-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
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
                                            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl cursor-pointer"
                                        >
                                            Sign Out
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="inline-flex items-center px-4 py-2 text-sm font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl transition shadow-md shadow-green-600/10"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile menu toggle & Theme toggler */}
                <div className="flex items-center gap-2 md:hidden">
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200 cursor-pointer"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-4 h-4 text-amber-500" />
                            ) : (
                                <Moon className="w-4 h-4 text-indigo-500" />
                            )}
                        </button>
                    )}

                    <Button
                        isIconOnly
                        variant="light"
                        radius="full"
                        onPress={() => {
                            setIsOpen((open) => !open)
                            setIsMobileAvatarOpen(false)
                        }}
                        aria-label="Toggle menu"
                        className="text-slate-800 dark:text-white"
                    >
                        {isOpen ? <FaX /> : <FaBars />}
                    </Button>
                </div>
            </header>

            {/* Mobile menu */}
            {isOpen && (
                <div className="border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 px-6 pb-6 pt-4 md:hidden">
                    <ul className="flex flex-col gap-4 text-sm font-medium">
                        {navitems.map((link) => (
                            <li key={link.href}>
                                <NavLink
                                    link={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="w-full justify-start py-2 text-slate-700 dark:text-slate-200"
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile auth */}
                    <div ref={mobileDropdownRef} className="mt-6 relative border-t border-slate-100 dark:border-slate-900 pt-4">
                        {user ? (
                            <div className="flex flex-col gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsMobileAvatarOpen((open) => !open)}
                                    className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
                                    aria-haspopup="menu"
                                    aria-expanded={isMobileAvatarOpen}
                                >
                                    <Avatar src={user.image} className="w-8 h-8" />
                                    <span>{user.name}</span>
                                </button>
                                {isMobileAvatarOpen && (
                                    <div className="mt-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xl">
                                        <ul className="flex flex-col gap-3 text-sm font-medium">
                                            {profileItems.map((link) => (
                                                <li key={link.href}>
                                                    <Link
                                                        href={link.href}
                                                        onClick={() => {
                                                            setIsOpen(false)
                                                            setIsMobileAvatarOpen(false)
                                                        }}
                                                        className="block text-slate-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
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
                                            className="mt-4 w-full justify-center bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl cursor-pointer"
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
                                    className="block w-full text-center px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition shadow-md shadow-green-600/10"
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
