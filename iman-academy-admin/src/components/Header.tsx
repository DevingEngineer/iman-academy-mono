import Image from 'next/image'
import AppLogo from '../../public/logo/iman_course_logo.png'
import { Button } from './Button'
import { SearchInput } from './SearchInput'
import { PlusIcon } from './icons/PlusIcon'

export const Header = () => {
	return (
		<header className='px-10 py-[31px] border-b border-[#ADADAD] flex items-center justify-between'>
			<Image src={AppLogo} alt='logo' width={148} height={36} />
			<div className='flex gap-5'>
				<SearchInput />
				<Button className=''>
					<PlusIcon />
					Создать курс
				</Button>
			</div>
		</header>
	)
}
