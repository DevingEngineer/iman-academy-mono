'use client'

import { Link } from '@/src/i18n/navigation'

export const FooterBottom = () => {
	const currentYear = new Date().getFullYear()

	return (
		<div className='py-5 border-t border-border_devider flex justify-between w550:flex-col'>
			<p className='body1 font-normal'>
				© {currentYear} All rights reserved
			</p>
			<div className='flex gap-5 w550:pt-4'>
				<Link href=''>Terms of Service</Link>
				<Link href=''>Privacy Policy</Link>
			</div>
		</div>
	)
}
