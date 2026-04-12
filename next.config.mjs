/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
            {
                protocol: "https",
                hostname: "*",
            },
        ],
    },
    experimental: {
        optimizePackageImports: [
            "lucide-react",
            "react-icons",
            "simple-icons",
            "gsap",
            "@gsap/react",
        ],
    },
};

export default nextConfig;
