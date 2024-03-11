import Link from 'next/link';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  return (
    <Link href={href} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
    {children}
    </Link>
  );
};

export default NavLink;
