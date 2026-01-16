import { Link } from '@/src/i18n/navigation'
import Image from 'next/image'
import Logo from '../../../public/logo/logo.png'
import { BurgerMenuIcon } from '../icons/BurgerMenuIcon'
import { FacebookIcon } from '../icons/FacebookIcon'
import { InstagramIcon } from '../icons/InstagramIcon'
import { PhoneIcon } from '../icons/PhoneIcon'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { HeaderActions } from './HeaderActions'
import { HeaderNav } from './HeaderNav'

export const Header = () => {
	return (
		<header className='py-[38px] w-full px-[110px] w1250:px-[60px] w1050:px-[40px] w850:px-[25px] w550:px-[16px]'>
			<div className='rounded-3xl flex w-full bg-[linear-gradient(90deg,#091E3A_0%,#091E3A_15%,#2F80ED_55%,#2D9EE0_100%)] w550:rounded-xl'>
				<div className='flex items-center justify-center'>
					<Image
						className='min-w-[77px] min-h-[77px]'
						src={Logo}
						alt='logo'
						width={77}
						height={77}
					/>
				</div>
				<div className='w-full border-l border-[#DEE5ED]'>
					<div className='flex items-center justify-between border-b border-[#DEE5ED] py-[15px] px-9 w750:px-5 w550:px-[10px]'>
						<Link
							href=''
							className='text-white flex items-center gap-[10px] text-nowrap'
						>
							<PhoneIcon /> 996 09090909
						</Link>
						<div className='flex items-center gap-5'>
							<LanguageSwitcher />
							<div className='flex items-center gap-5 text-background_light'>
								<FacebookIcon />
								<InstagramIcon />
							</div>
						</div>
					</div>
					<div className='flex items-center justify-between gap-[10px] px-9 py-[10px] w750:px-5 w550:px-[10px]'>
						<HeaderNav />
						<button className='hidden w750:block'>
							<BurgerMenuIcon />
						</button>
						<HeaderActions />
					</div>
				</div>
			</div>
		</header>
	)
}
