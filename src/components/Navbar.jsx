'use client'
import { Button } from '@heroui/react'
import Link from 'next/link'
import React, { useState } from 'react'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
            <header className="flex h-16 items-center justify-between px-6">
                <Link href="#" className="flex items-center gap-3 font-semibold">
                    <span>DriveSphere</span>
                    <span className="font-bold">ACME</span>
                </Link>

                <div className="hidden items-center gap-6 md:flex">
                    <ul className="flex items-center gap-4">
                        <li><Link href="#features">Features</Link></li>
                        <li><Link href="#pricing">Pricing</Link></li>
                    </ul>
                    <Button>Sign Up</Button>
                </div>

                <Button
                    className="md:hidden"
                    variant="flat"
                    onPress={() => setIsOpen((open) => !open)}
                >
                    Menu
                </Button>
            </header>

            {isOpen && (
                <div className="border-t border-separator px-6 py-4 md:hidden">
                    <ul className="flex flex-col gap-3">
                        <li><Link href="#features" onClick={() => setIsOpen(false)}>Features</Link></li>
                        <li><Link href="#pricing" onClick={() => setIsOpen(false)}>Pricing</Link></li>
                        <li><Button className="w-full" onPress={() => setIsOpen(false)}>Sign Up</Button></li>
                    </ul>
                </div>
            )}
        </nav>
    )
}

export default Navbar
