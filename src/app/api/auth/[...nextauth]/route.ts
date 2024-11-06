const authConfig = {
    trustHost: true,
    trustHostedDomain: true,
    pages: {
        signIn: `/login`,
    },
}

export { GET, POST } from '@/auth'
