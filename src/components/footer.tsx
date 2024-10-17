import { Divider, Link } from '@nextui-org/react'
import { SocialIcon } from 'react-social-icons'

// components/FooterSection.tsx

interface FooterSectionProps {
    title: string
    links: { href: string; label: string }[]
}

const FooterSection: React.FC<FooterSectionProps> = ({ title, links }) => {
    return (
        <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold uppercase">{title}</h3>
            <ul className="space-y-2">
                {links.map((link, index) => (
                    <li key={index}>
                        <Link href={link.href} className="text-zinc-200">
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

const footerLinks = {
    company: [
        { href: '/about/me', label: 'About Me' },
        { href: '/about/my-ebook', label: 'My eBook' },
        { href: '/contact', label: 'Contact' },
    ],
    legal: [
        { href: '/privacy-policy', label: 'Privacy Policy' },
        { href: '/terms-of-use', label: 'Terms of Use' },
    ],
    support: [
        { href: '/faq', label: 'FAQ' },
        { href: '/quiz', label: 'Quiz' },
        { href: '/', label: 'Buy Me a Coffee' },
    ],
}

const Footer = () => {
    return (
        <div className="bg-primary text-white rounded pt-16 mt-12 px-5">
            <footer className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 max-w-6xl mx-auto text-left text-white">
                <FooterSection title="Company" links={footerLinks.company} />
                <FooterSection title="Legal" links={footerLinks.legal} />
                <FooterSection title="Support" links={footerLinks.support} />
                <div className="flex flex-col space-y-4">
                    <h3 className="text-lg font-semibold">Follow Us</h3>
                    <div className="flex space-x-4">
                        <SocialIcon
                            url="www.youtube.com"
                            href="https://www.youtube.com/@oneromeo2409"
                            className="w-6 h-6" // Adjust the size as needed
                        />
                        <SocialIcon
                            url="www.xiaohongshu.com"
                            href="https://www.xiaohongshu.com/user/profile/61dbea62000000001000598f"
                            className="w-6 h-6" // Adjust the size as needed
                        />
                    </div>
                    <div className="flex flex-col text-sm text-zinc-400">
                        <p>No Catch, Just You and Me.</p>
                    </div>
                </div>
                <div className="col-span-1 sm:col-span-4 text-center mt-4">
                    <Divider className="my-4" />
                    <p>© 2024 OneRomeo.com. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default Footer
