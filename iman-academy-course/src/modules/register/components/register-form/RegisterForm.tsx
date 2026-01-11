'use client'

import { EmailIcon } from '@/src/components/icons/EmailIcon'
import { EyeOff } from '@/src/components/icons/EyeOff'
import { UserIcon } from '@/src/components/icons/UserIcon'
import { Button } from '@/src/components/UI/Button'
import { Checkbox } from '@/src/components/UI/Checkbox'
import { Input } from '@/src/components/UI/Input'
import Link from 'next/link'
import { useState } from 'react'

export const RegisterForm = () => {
	const [checked, setChecked] = useState(false)

	const handleCheck = () => {
		setChecked(!checked)
	}

	return (
		<form>
			<h4 className='h4'>Создать новый аккаунт</h4>
			<div className='mt-5 flex flex-col gap-5'>
				<Input label='Имя' required={true} type='text'>
					<div className='absolute top-1/2 -translate-y-1/2 right-4'>
						<UserIcon />
					</div>
				</Input>
				<Input label='Адрес электронной почты' required={true} type='email'>
					<div className='absolute top-1/2 -translate-y-1/2 right-4'>
						<EmailIcon />
					</div>
				</Input>
				<Input label='Пароль' required={true} type='password'>
					<div className='absolute top-1/2 -translate-y-1/2 right-4'>
						<EyeOff />
					</div>
				</Input>
				<Input label='Подтвердите пароль' required={true} type='password'>
					<div className='absolute top-1/2 -translate-y-1/2 right-4'>
						<EyeOff />
					</div>
				</Input>
				<div className='w-full flex justify-between items-start'>
					<Checkbox
						checked={checked}
						onChange={handleCheck}
						name='Я согласен'
					>
						Я согласен с{' '}
						<Link
							href='/'
							className='text-link !font-medium text-system_info'
						>
							Условиями и Политикой конфиденциальности
						</Link>
					</Checkbox>
				</div>
				<Button variant='contained' className='text-white mt-4'>
					Зарегистрироваться
				</Button>
				<p className='body2 !font-normal text-secondary_text'>
					Вы не впервые на нашей платформе?
					<Link href='/' className='underline text-system_info text-link'>
						Войдите вместо этого
					</Link>
				</p>
			</div>
		</form>
	)
}
