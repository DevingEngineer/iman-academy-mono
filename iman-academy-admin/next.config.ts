import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

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

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
