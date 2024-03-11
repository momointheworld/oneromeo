"use client";
import { useState } from 'react';
import { HomeIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'; 
import NavLink from '@/components/navlinks';
import Image from "next/image";
import Logo from "/public/sparrow.svg";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center border-solid border-1 border-zinc-300 rounded-full shadow-lg mt-5 px-5">
            <NavLink href="/"><HomeIcon className="h-6 w-6 text-black-500 btn" /></NavLink>
            <div className="hidden md:flex space-x-4">
              <NavLink href="/work">Work</NavLink>
              <NavLink href="/hobby">Hobby</NavLink>
              <NavLink href="/thoughts">Thoughts</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </div>
          </div>
          <Image className='justify-self-end pt-3' src={Logo} alt="sparrow logo" width="50" height="50" />
          {/* Hamburger menu for mobile */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-900 focus:outline-none">
              {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="flex flex-col mt-2 space-y-2 border-solid border-3 border-zinc-300 rounded-md shadow-lg mt-5 px-5">
              <NavLink href="/work">Work</NavLink>
              <NavLink href="/hobby">Hobby</NavLink>
              <NavLink href="/thoughts">Thoughts</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
