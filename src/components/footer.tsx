import { Divider, Link } from '@nextui-org/react'
import { SocialIcon } from 'react-social-icons'

// components/FooterSection.tsx

interface FooterSectionProps {
    title: string
    links: { href: string; label: string }[]
    color?: string
    fontSize?: string
}

const FooterSection: React.FC<FooterSectionProps> = ({
    title,
    links,
    color,
    fontSize,
}) => {
    return (
        <div className="md:col-span-1 text-center space-y-4 mb-5">
            <h3 className={`text-xl font-semibold uppercase`}>{title}</h3>
            <ul className="space-y-2">
                {links.map((link, index) => (
                    <li key={index}>
                        <Link
                            href={link.href}
                            className={`${fontSize} ${color}`}
                        >
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

        { href: '/about/me', label: 'About Me' },
        { href: '/about/my-ebook', label: 'My eBook' },
        { href: '/about/animation-bits', label: 'Animation Bits' },
        { href: '/privacy-policy', label: 'Privacy Policy' },
        { href: '/terms-of-use', label: 'Terms of Use' },
    ],
    fun: [{ href: '/quiz', label: 'Quiz' }],
}

const Footer = () => {
    return (
        <div className="bg-primary text-white rounded pt-16 mt-12 px-5">
            <footer className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 max-w-6xl mx-auto text-left text-white custom-font">
                <FooterSection
                    title="Fun."
                    links={footerLinks.fun}
                    fontSize="text-3xl"
                    color="text-orange-400"
                />
                <FooterSection
                    title="Explore."
                    links={footerLinks.explore}
                    fontSize="text-lg"
                    color="text-zinc-200"
                />
                <div className="md:col-start-3 md:col-span-1 text-center space-y-4 mb-5 text-lg">
                    <h3 className="text-xl font-semibold uppercase">
                        elsewhere.
                    </h3>
                    <div className="grid md:grid-cols-4 md:grid-rows-3 gap-2 items-center justify-items-center justify-center">
                        <SocialIcon
                            url="www.youtube.com"
                            href="https://www.youtube.com/@oneromeo2409"
                            className="w-6 h-6 col-start-2" // Adjust the size as needed
                        />
                        <SocialIcon
                            url="www.xiaohongshu.com"
                            href="https://www.xiaohongshu.com/user/profile/61dbea62000000001000598f"
                            className="w-6 h-6 col-start-3" // Adjust the size as needed
                        />
                        <SocialIcon
                            url="www.reddit.com"
                            href="https://www.reddit.com/r/JustHereToListen/"
                            className="w-6 h-6 drop-shadow-xl row-start-2 col-start-2" // Adjust the size as needed
                        />
                        <SocialIcon
                            url="www.discord.com"
                            href="https://discord.gg/FTMDwjSj"
                            className="w-6 h-6 row-start-2 col-start-3" // Adjust the size as needed
                        />
                    </div>
                </div>
                <div className="md:col-start-4 md:col-span-1 text-center space-y-4 mb-5 p-3 rounded-md shadow-xl bg-orange-100 origin-left rotate-12 shrink-1">
                    <div className="flex flex-col items-center gap-5">
                        <p className="text-2xl text-orange-600">
                            No Catch, <br />
                            Just You and Me.
                        </p>
                        <p className="text-xl text-blue-900">
                            What happens on One Romeo, stays on One Romeo.
                            <br /> All you share is confidential.
                        </p>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-12 text-green-700"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                            />
                        </svg>
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
