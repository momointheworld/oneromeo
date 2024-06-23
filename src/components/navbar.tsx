'use client'
import { useState, useEffect, Suspense } from 'react'
import { usePathname } from 'next/navigation'
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
} from '@nextui-org/react'
import Image from 'next/image'
import Logo from '/public/logo.png'
import Profile from '@/components/profile'
import { useSession } from 'next-auth/react'
import { CardSkeleton } from './common/skeleton-loading'

const MenuLogo = () => {
    return (
        <Image
            className="hidden md:flex justify-self-end pt-3 mx-5 aspect-ratio"
            src={Logo}
            alt="sparrow logo"
            priority
        />
    )
}

const menuItems = [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
]

interface ItemProps {
    title: string
    href: string
}

const NavbarComp = () => {
    const pathName = usePathname()
    const [activeMenuItem, setActiveMenuItem] = useState<ItemProps | null>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const session = useSession()

    useEffect(() => {
        const activeItem = menuItems.find((item) =>
            item.href === '/'
                ? pathName === '/'
                : pathName.startsWith(item.href)
        )
        if (activeItem) {
            setActiveMenuItem(activeItem)
        }
    }, [pathName])

    const handleMenuItemClick = (item: ItemProps) => {
        setActiveMenuItem(item)
        setIsMenuOpen(false)
    }

    return (
        <Suspense fallback={<CardSkeleton />}>
            <Navbar
                isMenuOpen={isMenuOpen}
                onMenuOpenChange={(isOpen) => setIsMenuOpen(isOpen)}
            >
                <NavbarContent>
                    <NavbarMenuToggle
                        className="sm:hidden"
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                    />
                    <NavbarBrand>
                        <MenuLogo />
                        <p className="font-bold text-inherit">One Romeo</p>
                    </NavbarBrand>
                </NavbarContent>
                <NavbarContent
                    className="hidden sm:flex items-center space-x-4 py-3 px-6 shadow-lg rounded-lg mt-2"
                    justify="center"
                >
                    {menuItems.map((item, index) => (
                        <NavbarItem
                            key={index}
                            isActive={item === activeMenuItem}
                        >
                            <Link
                                className="text-lg"
                                color={
                                    item === activeMenuItem
                                        ? 'primary'
                                        : 'foreground'
                                }
                                href={item.href}
                                onClick={() => handleMenuItemClick(item)}
                            >
                                {item.title}
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>
                <NavbarContent justify="end">
                    {session.data?.user && <Profile />}
                </NavbarContent>
                <NavbarMenu>
                    {menuItems.map((item, index) => (
                        <NavbarMenuItem key={`${item.title}-${index}`}>
                            <Link
                                color={
                                    item === activeMenuItem
                                        ? 'primary'
                                        : 'foreground'
                                }
                                className="w-full"
                                href={item.href}
                                size="lg"
                                onClick={() => handleMenuItemClick(item)}
                            >
                                {item.title}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </NavbarMenu>
            </Navbar>
        </Suspense>
    )
}

export default NavbarComp
