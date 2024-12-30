/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        STRIPE_PUBLISH_KEY_PROD: process.env.STRIPE_PUBLISH_KEY_PROD,
        NEXT_PUBLIC_STRIPE_PUBLISH_KEY_DEV: process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY_DEV,
        PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
        POSTGRES_URL: process.env.POSTGRES_URL,
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
                child_process: false,
            };
        }

        return config;
    },
    typescript: {
        ignoreBuildErrors: false,
    },
};

export default nextConfig;