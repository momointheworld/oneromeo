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
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
} from '@nextui-org/react'
import Image from 'next/image'
import Logo from '/public/logo-circle.png'
import Profile from '@/components/profile'
import { useSession } from 'next-auth/react'
import { CardSkeleton } from './common/skeleton-loading'

const MenuLogo = () => {
    return (
        <div className="relative w-16 h-16 flex justify-start items-center p-2 mr-5">
            <Image
                className="object-contain" // Ensures the image maintains its aspect ratio
                src={Logo}
                alt="One Romeo Logo"
                priority={true}
            />
        </div>
    )
}

const menuItems = [
    { title: 'Home', href: '/' },
    {
        title: 'About',
        href: '/about',
        children: [
            { title: 'Me', href: '/about/me' },
            { title: 'My eBook', href: '/about/my-ebook' },
        ],
    },
    { title: 'FAQ', href: '/faq' },
    { title: 'Contact', href: '/contact' },
]

const icons = {
    dropDownIcon: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
        </svg>
    ),
    rightIcon: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
        </svg>
    ),
    meIcon: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            color="purple"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
            />
        </svg>
    ),
    bookIcon: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            color="blue"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
        </svg>
    ),
}

interface ItemProps {
    title: string
    href: string
    children?: ItemProps[]
}

const NavbarComp = () => {
    const pathName = usePathname()
    // const [activeMenuItem, setActiveMenuItem] = useState<ItemProps | null>(null)
    const [activeMenuItems, setActiveMenuItems] = useState<ItemProps[]>([])
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const session = useSession()

    useEffect(() => {
        const findActiveItems = (
            path: string,
            items: ItemProps[]
        ): ItemProps[] => {
            let activeItems: ItemProps[] = []

            for (const item of items) {
                if (item.href === path) {
                    activeItems.push(item)
                }
                if (item.children) {
                    const childActiveItems = findActiveItems(
                        path,
                        item.children
                    )
                    if (childActiveItems.length > 0) {
                        activeItems.push(item, ...childActiveItems)
                    }
                }
            }

            return activeItems
        }

        const activeItems = findActiveItems(pathName, menuItems)
        setActiveMenuItems(activeItems)
    }, [pathName])

    const handleMenuItemClick = (item: ItemProps) => {
        setActiveMenuItems([item])
        setIsMenuOpen(false)
    }

    const isActive = (item: ItemProps) => {
        return activeMenuItems.some(
            (i) => i === item || (i.children && i.children.includes(item))
        )
    }

    return (
        <Suspense fallback={<CardSkeleton />}>
            <Navbar
                isMenuOpen={isMenuOpen}
                onMenuOpenChange={(isOpen) => setIsMenuOpen(isOpen)}
                height="6rem"
                className="bg-primary text-white rounded"
            >
                <NavbarContent>
                    <NavbarMenuToggle
                        className="sm:hidden"
                        onChange={() => setIsMenuOpen((prev) => !prev)}
                    />
                    <NavbarBrand>
                        <MenuLogo />
                        <p className="font-bold text-inherit">One Romeo</p>
                    </NavbarBrand>
                </NavbarContent>
                <NavbarContent
                    className="hidden sm:flex items-center space-x-4 py-3 px-6 rounded-lg mt-2 text-white"
                    justify="center"
                >
                    {menuItems.map((item, index) =>
                        item.children ? (
                            <Dropdown key={index}>
                                <NavbarItem
                                    key={index}
                                    isActive={isActive(item)}
                                >
                                    <DropdownTrigger>
                                        {/* Button is the Parent Nav Item */}
                                        <Button
                                            disableRipple
                                            className={`p-0 bg-transparent data-[hover=true]:bg-transparent self-start text-lg text-white ${
                                                activeMenuItems.includes(item)
                                                    ? 'font-bold underline'
                                                    : ''
                                            }`}
                                            endContent={icons.dropDownIcon}
                                            radius="sm"
                                            variant="light"
                                        >
                                            {item.title}
                                        </Button>
                                    </DropdownTrigger>
                                </NavbarItem>
                                <DropdownMenu
                                    aria-label={item.title}
                                    className="w-[340px]"
                                    itemClasses={{
                                        base: 'gap-4',
                                    }}
                                >
                                    {/* display the menu nav item based on whether it has .children */}
                                    {item.children.map((child, idx) => (
                                        <DropdownItem
                                            key={idx}
                                            startContent={
                                                child.title === 'Me'
                                                    ? icons.meIcon
                                                    : icons.bookIcon
                                            }
                                            textValue={child.title} // Add textValue prop here
                                            onClick={() => {
                                                // Navigate directly on DropdownItem click
                                                handleMenuItemClick(child)
                                                window.location.href =
                                                    child.href // Navigate to the link
                                            }}
                                        >
                                            <Link
                                                className="text-lg"
                                                underline={
                                                    activeMenuItems.includes(
                                                        child
                                                    )
                                                        ? 'always'
                                                        : 'none'
                                                }
                                                href={child.href}
                                            >
                                                {child.title}
                                            </Link>
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        ) : (
                            <NavbarItem key={index} isActive={isActive(item)}>
                                <Link
                                    className="text-lg text-white"
                                    underline={
                                        activeMenuItems.includes(item)
                                            ? 'always'
                                            : 'none'
                                    }
                                    href={item.href}
                                    onPress={() => handleMenuItemClick(item)}
                                >
                                    {item.title}
                                </Link>
                            </NavbarItem>
                        )
                    )}
                </NavbarContent>
                <NavbarContent justify="end">
                    {session.data?.user && <Profile />}
                </NavbarContent>

                {/* Navbar for small screen */}
                <NavbarMenu className="sm:justify-start">
                    {menuItems.map((item, index) =>
                        item.children ? (
                            <Dropdown key={`${item.title}-${index}`}>
                                <NavbarMenuItem
                                    key={index}
                                    isActive={isActive(item)}
                                >
                                    <DropdownTrigger>
                                        {/* Button is the Parent Nav Item */}
                                        <Button
                                            disableRipple
                                            className={`p-0 bg-transparent data-[hover=true]:bg-transparent self-start text-lg text-primary ${
                                                activeMenuItems.includes(item)
                                                    ? 'underline'
                                                    : ''
                                            }`}
                                            endContent={icons.rightIcon}
                                            radius="sm"
                                            variant="light"
                                        >
                                            {item.title}
                                        </Button>
                                    </DropdownTrigger>
                                </NavbarMenuItem>
                                <DropdownMenu
                                    aria-label={item.title}
                                    className="w-[340px]"
                                    itemClasses={{
                                        base: 'gap-4',
                                    }}
                                >
                                    {item.children.map((child, idx) => (
                                        <DropdownItem
                                            key={idx}
                                            startContent={
                                                child.title === 'Me'
                                                    ? icons.meIcon
                                                    : icons.bookIcon
                                            }
                                            textValue={child.title}
                                            onClick={() => {
                                                // Navigate directly on DropdownItem click
                                                handleMenuItemClick(child)
                                                window.location.href =
                                                    child.href // Navigate to the link
                                            }}
                                        >
                                            <Link
                                                underline={
                                                    activeMenuItems.includes(
                                                        child
                                                    )
                                                        ? 'always'
                                                        : 'none'
                                                }
                                                className="flex items-center w-full text-lg"
                                                href={child.href}
                                            >
                                                {child.title}
                                            </Link>
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        ) : (
                            <NavbarMenuItem key={`${item.title}-${index}`}>
                                <Link
                                    underline={
                                        activeMenuItems.includes(item)
                                            ? 'always'
                                            : 'none'
                                    }
                                    className="w-full text-lg"
                                    href={item.href}
                                    onPress={() => handleMenuItemClick(item)}
                                >
                                    {item.title}
                                </Link>
                            </NavbarMenuItem>
                        )
                    )}
                </NavbarMenu>
            </Navbar>
        </Suspense>
    )
}

export default NavbarComp
