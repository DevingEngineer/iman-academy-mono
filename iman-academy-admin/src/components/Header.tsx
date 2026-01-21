import Image from 'next/image'
import AppLogo from '../../public/logo/iman_course_logo.png'
import { Button } from './Button'
import { NotificationIcon } from './icons/NotificationIcon'
import { PlusIcon } from './icons/PlusIcon'
import { SearchInput } from './SearchInput'
import { UserProfile } from './UserProfile'

export const Header = () => {
	return (
		<header className='px-10 py-[31px] border-b border-[#ADADAD] flex items-center justify-between'>
			<Image src={AppLogo} alt='logo' width={148} height={36} />
			<div className='flex items-center gap-5'>
				<SearchInput />
				<Button className=''>
					<PlusIcon />
					Создать курс
				</Button>
				<div className='relative'>
					<NotificationIcon />
					<div className='rounded-full flex items-center justify-center absolute top-[-3px] border border-color_bg_gray right-0 w-[11px] h-[11px] bg-color_text_primary text-[8px] text-color_system_green'>
						6
					</div>
				</div>
				<UserProfile />
			</div>
		</header>
	)
}
