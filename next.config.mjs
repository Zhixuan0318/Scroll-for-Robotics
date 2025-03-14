/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                port: '',
                pathname: '**',
            },
        ],
    },
    env: {
        NEXT_PUBLIC_WORLDCOIN_APP_ID: '',
        NEXT_PUBLIC_PROJECT_ID: '',
        NEXT_PUBLIC_APP_URL: '',
        NEXT_PUBLIC_EXPLORER: '',

        FIREBASE_MAIL: '',
        FIREBASE_PASSWORD: '',

        PROVIDER: '',
        OWNER_PK: '',

        PINATA_JWT:
            '',
    },
};

export default nextConfig;
