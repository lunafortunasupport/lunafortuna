/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // آدرسِ کاتالوگ از /preview/trendyol به /catalog منتقل شد؛ لینک‌ها/بوکمارک‌های قدیمی
  // برای همیشه ریدایرکت می‌شوند تا خراب نشوند.
  async redirects() {
    return [
      { source: "/preview/trendyol", destination: "/catalog", permanent: true },
      { source: "/preview/trendyol/:path*", destination: "/catalog/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
