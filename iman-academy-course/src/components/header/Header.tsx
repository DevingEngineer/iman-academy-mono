import { BurgerMenuIcon } from '@/public/icons/header/BurgerMenuIcon'
import { PhoneIcon } from '@/public/icons/header/PhoneIcon'
import { Facebook } from '@/public/icons/social-network/Facebook'
import { Instagram } from '@/public/icons/social-network/Instagram'
import { Link } from '@/src/i18n/navigation'
import Image from 'next/image'
import Logo from '../../../public/logo/logo.png'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { HeaderActions } from './HeaderActions'
import { HeaderNav } from './HeaderNav'

export const Header = () => {
	return (
		<header className='py-[38px] w-full px-[110px] w1250:px-[60px] w1050:px-[40px] w850:px-[25px] w550:px-[16px]'>
			<div className='rounded-3xl flex w-full bg-[linear-gradient(90deg,#091E3A_0%,#091E3A_15%,#2F80ED_55%,#2D9EE0_100%)] w550:rounded-xl'>
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
					<div className='flex items-center justify-between border-b border-[#DEE5ED] py-[15px] px-9 w750:px-5'>
						<Link
							href=''
							className='text-white flex items-center gap-[10px]'
						>
							<PhoneIcon /> 996 09090909
						</Link>
						<div className='flex items-center gap-5'>
							<LanguageSwitcher />
							<div className='flex items-center gap-5'>
								<Facebook />
								<Instagram />
							</div>
						</div>
					</div>
					<div className='flex items-center justify-between gap-[10px] px-9 py-[10px] w750:px-5'>
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
