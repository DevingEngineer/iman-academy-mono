import { EmailIcon } from '@/src/components/icons/EmailIcon'
import { Button } from '@/src/components/UI/Button'
import { Input } from '@/src/components/UI/Input'

export const ForgotPasswordForm = () => {
	return (
		<form>
			<h4 className='h4'>Забыли пароль?</h4>
			<div className='mt-5 flex flex-col gap-5'>
				<Input label='Электронная почта' required={true} type='email'>
					<div className='absolute top-1/2 -translate-y-1/2 right-4'>
						<EmailIcon />
					</div>
				</Input>
				<Button variant='contained' className='text-white mt-4'>
					Отправить
				</Button>
			</div>
		</form>
	)
}
