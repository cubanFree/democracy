/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'aryypsyzvhuiuehpauou.supabase.co',
            }
        ],
    },
    experimental: {
        serverActions: {
          bodySizeLimit: '10mb' // Puedes ajustar el límite a tus necesidades, por ejemplo 10mb
        }
    }
}

module.exports = nextConfig
