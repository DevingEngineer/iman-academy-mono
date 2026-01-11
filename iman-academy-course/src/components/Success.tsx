import { CheckIcon } from './icons/CheckIcon'
import { Button } from './UI/Button'

export const Success = () => {
	return (
		<div className='flex flex-col items-center justify-center gap-5'>
			<div className='relative w-10 h-10 rounded-full bg-system_success'>
				<CheckIcon className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transform scale-150' />
			</div>
			<div className='text-center'>
				<h4 className='h4'>Пароль успешно обновлён</h4>
				<p className='body1 !font-normal text-secondary_text mt-1'>
					Пожалуйста, войдите снова с вашим новым паролем
				</p>
			</div>
			<Button className='w-full text-white' variant='contained'>
				Войти сейчас
			</Button>
		</div>
	)
}
