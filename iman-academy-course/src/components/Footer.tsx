import { FacebookIcon } from '@/public/icons/social-network/FacebookIcon'
import { InstagramIcon } from '@/public/icons/social-network/InstagramIcon'
import { Link } from '../i18n/navigation'
import { FooterShape } from './icons/FooterShape'

export const Footer = () => {
	return (
		<footer className='mt-auto pt-[169px] pb-[30px] relative w1050:pt-[80px] w950:pt-[60px] w850:pt-[50px] w750:pt-[40px]'>
			<FooterShape className='w-full absolute top-0 -z-10' />

			<div className='max-w-[1090px] mx-auto pb-[35px] px-[36px] w370:px-4'>
				<div className='py-[48px] px-[59px] rounded-3xl bg-accent_brand flex items-center gap-6 w750:flex-col w750:p-5'>
					<div className='max-w-[368px] w750:max-w-full'>
						<h4 className='h4 mb-1'>Подписаться на рассылки</h4>
						<p className='body3 text-primary_text'>
							Подпишитесь на нашу рассылку и откройте мир эксклюзивных
							преимуществ. Будьте первыми, кто узнает о наших новых
							продуктах, специальных акциях и захватывающих обновлениях.
						</p>
					</div>
					<div className='flex rounded bg-[#F7C740] py-[1px] px-[1px] max-w-[583px] w-full w370:flex-col'>
						<input
							type='email'
							placeholder='Введите ваш email'
							className='flex-1 min-w-0 bg-transparent rounded-tl rounded-bl py-2 px-[18px] text-primary_text placeholder:text-primary_text'
						/>
						<button className='text-nowrap text-xs font-medium leading-[138%] bg-primary_brand py-3 px-[23px] text-white rounded w550:px-2'>
							Подписаться сейчас
						</button>
					</div>
				</div>
				<div className='pt-[70px] text-primary_text flex items-center justify-between w370:flex-col w370:items-end'>
					<ul className='flex items-center gap-6'>
						<li>
							<Link href=''>TEXT</Link>
						</li>
						<li>
							<Link href=''>TEXT</Link>
						</li>
						<li>
							<Link href=''>TEXT</Link>
						</li>
						<li>
							<Link href=''>TEXT</Link>
						</li>
						<li>
							<Link href=''>TEXT</Link>
						</li>
					</ul>
					<div className='flex items-center gap-5 w370:pt-4'>
						<FacebookIcon className='text-current' />
						<InstagramIcon className='text-current' />
					</div>
				</div>
			</div>
			<div className='px-[72px] w750:px-4'>
				<div className='py-5 border-t border-border_devider flex justify-between w550:flex-col'>
					<p className='body1 font-normal'>© 2026 All rights reserved</p>
					<div className='flex gap-5 w550:pt-4'>
						<Link href=''>Terms of Service</Link>
						<Link href=''>Privacy Policy</Link>
					</div>
				</div>
			</div>
		</footer>
	)
}
