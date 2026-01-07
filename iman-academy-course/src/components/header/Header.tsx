import { Facebook } from '@/public/icons/social-network/Facebook'
import { Instagram } from '@/public/icons/social-network/Instagram'
import { Link } from '@/src/i18n/navigation'
import Image from 'next/image'
import Logo from '../../../public/logo/logo.png'
import { Button } from '../Button'
import { LanguageSwitcher } from '../LanguageSwitcher'

export const Header = () => {
	return (
		<header className='w-full px-[110px]'>
			<div className='rounded-3xl flex w-full bg-[linear-gradient(90deg,#091E3A_0%,#091E3A_15%,#2F80ED_55%,#2D9EE0_100%)]'>
				<div className='flex items-center justify-center'>
					<Image
						className='w-[77px] h-[77px]'
						src={Logo}
						alt='logo'
						width={77}
						height={77}
					/>
				</div>
				<div className='w-full border-l border-[#DEE5ED]'>
					<div className='flex items-center justify-between border-b border-[#DEE5ED] py-[15px] px-9'>
						<Link href='' className='text-white'>
							996 09090909
						</Link>
						<div className='flex items-center gap-5'>
							<LanguageSwitcher />
							<div className='flex items-center gap-5'>
								<Facebook />
								<Instagram />
							</div>
						</div>
					</div>
					<div className='flex items-center justify-between px-9 py-[10px]'>
						<ul className='flex items-center gap-10 text-white'>
							<li className='button-label'>
								<Link href='/directions'>Направления</Link>
							</li>
							<li className='button-label'>
								<Link href='/courses'>Курсы</Link>
							</li>
							<li className='button-label'>
								<Link href='/how-we-teach'>Как учим?</Link>
							</li>
							<li className='button-label'>
								<Link href='/questions'>Вопросы</Link>
							</li>
						</ul>
						<div className='flex gap-[10px] max-w-[217px] w-full'>
							<Button className='h-[44px]' variant='outlined'>
								Log In
							</Button>
							<Button className='h-[44px]' variant='contained'>
								Register
							</Button>
						</div>
					</div>
				</div>
			</div>
		</header>
	)
}
