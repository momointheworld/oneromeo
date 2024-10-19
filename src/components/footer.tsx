import { Divider, Link } from '@nextui-org/react'
import { SocialIcon } from 'react-social-icons'
import EmbedVideo from './embedVideo'

// components/FooterSection.tsx

interface FooterSectionProps {
    title: string
    links: { href: string; label: string }[]
}

const FooterSection: React.FC<FooterSectionProps> = ({ title, links }) => {
    return (
        <div className="md:col-start-2 md:col-span-1 text-center space-y-4 mb-5">
            <h3 className="text-lg font-semibold uppercase ">{title}</h3>
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
    // FAQ, contact, quiz, privacy policy, terms of use, about me, my e-book
    explore: [
        { href: '/faq', label: 'FAQ' },
        { href: '/contact', label: 'Contact' },
        { href: '/quiz', label: 'Quiz' },
        { href: '/about/me', label: 'About Me' },
        { href: '/about/my-ebook', label: 'My eBook' },
        { href: '/privacy-policy', label: 'Privacy Policy' },
        { href: '/terms-of-use', label: 'Terms of Use' },
    ],
}

const Footer = () => {
    return (
        <div className="bg-primary text-white rounded pt-16 mt-12 px-5">
            <footer className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 max-w-6xl mx-auto text-left text-white  custom-font">
                <FooterSection title="Explore" links={footerLinks.explore} />
                <div className="md:col-start-3 md:col-span-1 text-center space-y-4 mb-5 ">
                    <h3 className="text-lg font-semibold uppercase">
                        elsewhere
                    </h3>
                    <div className="flex space-x-4 justify-center">
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
                    <div className="flex flex-col text-sm text-zinc-400 gap-5">
                        <p>No Catch, Just You and Me.</p>
                        <p>
                            What happens on One Romeo, stays on One Romeo. All
                            you share is confidential.
                        </p>
                    </div>
                </div>
                {/* <div className="md:col-start-3 md:col-span-2 mb-5 text-center">
                    <EmbedVideo videoId={'h42kK7HqGB8?si=30vhr_GVxaDbu3VX'} />
                </div> */}
                <div className="col-span-1 sm:col-span-4 text-center mt-4">
                    <Divider className="my-4" />
                    <p>© 2024 OneRomeo.com. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default Footer
