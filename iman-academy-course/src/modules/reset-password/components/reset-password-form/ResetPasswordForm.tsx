import { EyeOff } from '@/src/components/icons/EyeOff'
import { Button } from '@/src/components/UI/Button'
import { Input } from '@/src/components/UI/Input'

export const ResetPasswordForm = () => {
	return (
		<form>
			<h4 className='h4'>Сбросить пароль?</h4>
			<div className='mt-5 flex flex-col gap-5'>
				<Input label='Новый пароль' required={true} type='password'>
					<div className='absolute top-1/2 -translate-y-1/2 right-4'>
						<EyeOff />
					</div>
				</Input>
				<Input label='Подтвердите пароль' required={true} type='password'>
					<div className='absolute top-1/2 -translate-y-1/2 right-4'>
						<EyeOff />
					</div>
				</Input>
				<Button variant='contained' className='text-white mt-4'>
					Изменить пароль
				</Button>
			</div>
		</form>
	)
}
