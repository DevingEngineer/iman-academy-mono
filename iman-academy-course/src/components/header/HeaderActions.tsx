import { Link } from '@/src/i18n/navigation'
import { Button } from '../Button'

export const HeaderActions = () => {
	return (
		<div className='flex gap-[10px] '>
			<Button className='h-[44px] px-4 w750:text-[14px]' variant='outlined'>
				<Link href='/login'>Войти</Link>
			</Button>
			<Button className='h-[44px] px-4 w750:text-[14px]' variant='contained'>
				<Link href='/register'>Регистрация</Link>
			</Button>
		</div>
	)
}
