'use client'

import { EmailIcon } from '@/src/components/icons/EmailIcon'
import { EyeOff } from '@/src/components/icons/EyeOff'
import { AuthFormError } from '@/src/components/AuthFormError'
import { Button } from '@/src/components/UI/Button'
import { Checkbox } from '@/src/components/UI/Checkbox'
import { Input } from '@/src/components/UI/Input'
import { Link, useRouter } from '@/src/i18n/navigation'
import { useAuth } from '@/src/providers/AuthProvider'
import { FormEvent, useState } from 'react'

export const RegisterForm = () => {
	const router = useRouter()
	const { register } = useAuth()
	const [checked, setChecked] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState<unknown | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleCheck = () => {
		setChecked(!checked)
	}

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError(null)

		if (password !== confirmPassword) {
			setError('Пароли не совпадают')
			return
		}

		if (!checked) {
			setError('Необходимо принять условия и политику конфиденциальности')
			return
		}

		setIsSubmitting(true)

		try {
			await register({ email, password })
			router.push('/')
		} catch (err) {
			setError(err)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<h4 className='h4 text-center'>Создать новый аккаунт</h4>
			<div className='mt-5 flex flex-col gap-5'>
				<Input
					label='Адрес электронной почты'
					required={true}
					type='email'
					name='email'
					value={email}
					onChange={event => setEmail(event.target.value)}
					autoComplete='email'
				>
					<div className='absolute top-1/2 -translate-y-1/2 right-4'>
						<EmailIcon />
					</div>
				</Input>
				<Input
					label='Пароль'
					required={true}
					type='password'
					name='password'
					value={password}
					onChange={event => setPassword(event.target.value)}
					autoComplete='new-password'
				>
					<div className='absolute top-1/2 -translate-y-1/2 right-4'>
						<EyeOff />
					</div>
				</Input>
				<Input
					label='Подтвердите пароль'
					required={true}
					type='password'
					name='confirmPassword'
					value={confirmPassword}
					onChange={event => setConfirmPassword(event.target.value)}
					autoComplete='new-password'
				>
					<div className='absolute top-1/2 -translate-y-1/2 right-4'>
						<EyeOff />
					</div>
				</Input>
				<div className='w-full flex justify-between items-start'>
					<Checkbox
						checked={checked}
						onChange={handleCheck}
						name='terms'
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
				<AuthFormError error={error} fallback='Не удалось зарегистрироваться' />
				<Button
					type='submit'
					variant='contained'
					className='text-white mt-4'
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
				</Button>
				<p className='body2 !font-normal text-secondary_text'>
					Вы не впервые на нашей платформе?{' '}
					<Link href='/login' className='underline text-system_info text-link'>
						Войдите вместо этого
					</Link>
				</p>
			</div>
		</form>
	)
}
