import { NextConfig } from 'next'

const nextConfig: NextConfig = {
	devIndicators: false,
	images: {
		formats: ['image/avif'],
		remotePatterns: [
			{
				hostname: '*',
				protocol: 'https',
			},
		],
	},
}

export default nextConfig
