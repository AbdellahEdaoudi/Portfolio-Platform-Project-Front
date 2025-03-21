/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      remotePatterns: [
          {
              protocol: 'https',
              hostname: 'img.clerk.com',
          },
          {
              protocol: 'https',
              hostname: 'res.cloudinary.com',
          },
          {
              protocol: 'https',
              hostname: 'lh3.googleusercontent.com',
          },
          {
              protocol: 'https',
              hostname: 'avatars.githubusercontent.com',
          },
      ],
  },
};

export default nextConfig;
