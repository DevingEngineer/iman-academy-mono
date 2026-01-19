import { InstagramIcon } from '@/src/components/icons/InstagramIcon'
import { Link } from '../../i18n/navigation'
import { FacebookIcon } from '../icons/FacebookIcon'
import { FooterShape } from '../icons/FooterShape'
import { FooterBottom } from './FooterBottom'
import { FooterLinks } from './FooterLinks'
import { NewsletterForm } from './NewsletterForm'

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
					<NewsletterForm />
				</div>
				<div className='pt-[70px] text-primary_text flex items-center justify-between w370:flex-col w370:items-end'>
					<FooterLinks />
					<div className='flex items-center gap-5 w370:pt-4'>
						<Link href='' className='text-current'>
							<FacebookIcon />
						</Link>
						<Link href='' className='text-current'>
							<InstagramIcon />
						</Link>
					</div>
				</div>
			</div>
			<div className='px-[72px] w750:px-4'>
				<FooterBottom />
			</div>
		</footer>
	)
}
