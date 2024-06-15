import { Divider, Link } from '@nextui-org/react'
import { SocialIcon } from 'react-social-icons'

function Footer() {
    return (
        <footer className="flex flex-col">
            <div className="flex flex-row my-5 md:self-end justify-center items-center space-x-4 text-small">
                <SocialIcon
                    url="www.youtube.com"
                    href="https://www.youtube.com/@oneromeo2409"
                    className="w-4 h-4" // Adjust the size as needed
                />
                <SocialIcon
                    url="www.facebook.com"
                    href="https://www.youtube.com/@oneromeo2409"
                    className="w-4 h-4" // Adjust the size as needed
                />
            </div>
            <Divider className="my-4" />
            <div className="flex flex-col sm:flex-row w-full sm:w-auto my-5 justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 text-small">
                <Link href="/privacy">Privacy Policy</Link>
                <Divider orientation="vertical" />
                <Link href="/terms">Terms of Services</Link>
                <Divider orientation="vertical" />
                <p>© 2024 OneRomeo.com. All Rights Reserved.</p>
            </div>
        </footer>
    )
}

export default Footer
