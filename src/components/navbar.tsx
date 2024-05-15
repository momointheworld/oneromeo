"use client";
import { useState, useEffect } from 'react';
import { usePathname } from "next/navigation";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@nextui-org/react';
import Image from 'next/image';
import Logo from "/public/sparrow.svg";
import Profile from './profile';

const MenuLogo = () => {
  return (
    <Image className='hidden md:flex justify-self-end pt-3 mx-5' src={Logo} alt="sparrow logo" width="50" />
  )
}

const menuItems = [
  { title: "Home", href: '/' },
  { title: "About", href: '/about' },
  { title: "Contact", href: '/contact' },
  { title: "Dashboard", href: '/dashboard' },
];

interface ItemProps {
  title: string;
  href: string;
}

const NavbarComp = () => {
  const pathName = usePathname();
  const [activeMenuItem, setActiveMenuItem] = useState<ItemProps | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const activeItem = menuItems.find(item => {
      if (item.href === "/") {
        return pathName === "/";
      }
      return pathName.startsWith(item.href);
    });
    setActiveMenuItem(activeItem || null);
  }, [pathName]);

  const handleMenuItemClick = (item: ItemProps) => {
    setActiveMenuItem(item);
    setIsMenuOpen(false);
  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <p className="font-bold text-inherit">One Romeo</p>
          <MenuLogo />
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={index} isActive={item === activeMenuItem}>
            <Link
              color={item === activeMenuItem ? "primary" : "foreground"} 
              href={item.href}
              onClick={() => handleMenuItemClick(item)}
            >
              {item.title}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <Profile />
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={item === activeMenuItem ? "primary" : "foreground"}
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
  );
}

export default NavbarComp;
