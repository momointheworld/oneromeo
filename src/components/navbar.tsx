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
import Logo from '/public/sparrow.svg'
import Profile from '@/components/profile'
import { useSession } from 'next-auth/react'

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
    { title: 'Price', href: '/price' },
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
        console.log('Menu item clicked:', item)
        setActiveMenuItem(item)
        setIsMenuOpen(false)
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Navbar onMenuOpenChange={setIsMenuOpen}>
                <NavbarContent>
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        className="sm:hidden"
                    />
                    <NavbarBrand>
                        <p className="font-bold text-inherit">One Romeo</p>
                        <MenuLogo />
                    </NavbarBrand>
                </NavbarContent>
                <NavbarContent
                    className="hidden sm:flex gap-4"
                    justify="center"
                >
                    {menuItems.map((item, index) => (
                        <NavbarItem
                            key={index}
                            isActive={item === activeMenuItem}
                        >
                            <Link
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
                    {/* shows the profile only after logged in */}
                    {session.data?.user && <Profile />}
                </NavbarContent>
                <NavbarMenu>
                    {menuItems.map((item, index) => (
                        <NavbarMenuItem key={`${item}-${index}`}>
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
