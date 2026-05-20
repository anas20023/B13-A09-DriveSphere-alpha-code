'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"

const NavLink = ({ children, link, className = '', onClick }) => {
    const pathname = usePathname()
    const isActive = pathname === link

    return (
        <Link
            href={link}
            onClick={onClick}
            aria-current={isActive ? 'page' : undefined}
            className={`relative inline-block text-sm font-medium no-underline transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-green-600 dark:after:bg-green-400 after:transition-all ${isActive ? 'text-green-600 dark:text-green-400 after:w-full' : 'text-slate-600 dark:text-slate-300 after:w-0 hover:text-green-600 dark:hover:text-green-400 hover:after:w-full'} ${className}`}
        >
            {children}
        </Link>
    )
}

export default NavLink
