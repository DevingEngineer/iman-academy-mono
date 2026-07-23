'use client'

import { EmailIcon } from '@/src/components/icons/EmailIcon'
import { EyeOff } from '@/src/components/icons/EyeOff'
import { Button } from '@/src/components/UI/Button'
import { Checkbox } from '@/src/components/UI/Checkbox'
import { Input } from '@/src/components/UI/Input'
import Link from 'next/link'
import { useState } from 'react'

export const LoginForm = () => {
	const [checked, setChecked] = useState(false)

	const handleCheck = () => {
		setChecked(!checked)
	}

	return (
		<form>
			<h4 className='h4 text-center'>Добро пожаловать!</h4>
			<div className='mt-5 flex flex-col gap-5'>
				<Input label='Электронная почта' required={true} type='email'>
					<div className='absolute top-1/2 -translate-y-1/2 right-4'>
						<EmailIcon />
					</div>
				</Input>
				<Input label='Пароль' required={true} type='password'>
					<div className='absolute top-1/2 -translate-y-1/2 right-4'>
						<EyeOff />
					</div>
				</Input>
				<div className='flex justify-between items-center'>
					<Checkbox
						checked={checked}
						onChange={handleCheck}
						name='Запомнить меня'
					>
						Я согласен с{' '}
					</Checkbox>
					<Link
						href='/'
						className='text-link !font-medium text-system_error'
					>
						Забыли пароль?
					</Link>
				</div>
				<Button variant='contained' className='text-white mt-4'>
					Войти
				</Button>
				<p className='body2 !font-normal text-secondary_text'>
					Вы впервые на нашей платформе?
					<Link
						href='/register'
						className='underline text-system_info text-link'
					>
						Создайте аккаунт
					</Link>
				</p>
			</div>
		</form>
	)
}
