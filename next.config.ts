/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
     domains: ['otiguqxiaslvdxehkzlz.supabase.co'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "otiguqxiaslvdxehkzlz.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

module.exports = nextConfig;
