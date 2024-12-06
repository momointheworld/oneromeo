// next.config.js

module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'avatars.githubusercontent.com',
          port: '',
          pathname: '/u/**',
        },
      ],
    },
    experimental: {
      serverActions: {
          allowedOrigins: ["localhost:3000", "oneromeo.com"]
      },
  },
  }
  