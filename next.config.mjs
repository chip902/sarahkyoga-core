/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_STRAPI_API_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
        STRIPE_PUBLISH_KEY_PROD: process.env.STRIPE_PUBLISH_KEY_PROD,
        STRAPI_TOKEN: process.env.STRAPI_TOKEN,
        NEXT_PUBLIC_STRIPE_PUBLISH_KEY_DEV: process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY_DEV,
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
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
