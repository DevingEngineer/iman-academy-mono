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

export const LoginForm = () => {
	const router = useRouter()
	const { login } = useAuth()
	const [checked, setChecked] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<unknown | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleCheck = () => {
		setChecked(!checked)
	}

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError(null)
		setIsSubmitting(true)

		try {
			await login({ email, password })
			router.push('/')
		} catch (err) {
			setError(err)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<h4 className='h4 text-center'>Добро пожаловать!</h4>
			<div className='mt-5 flex flex-col gap-5'>
				<Input
					label='Электронная почта'
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
					autoComplete='current-password'
				>
					<div className='absolute top-1/2 -translate-y-1/2 right-4'>
						<EyeOff />
					</div>
				</Input>
				<div className='flex justify-between items-center'>
					<Checkbox
						checked={checked}
						onChange={handleCheck}
						name='remember-me'
					>
						Запомнить меня
					</Checkbox>
					<Link
						href='/forgot-password'
						className='text-link !font-medium text-system_error'
					>
						Забыли пароль?
					</Link>
				</div>
				<AuthFormError error={error} fallback='Не удалось войти' />
				<Button
					type='submit'
					variant='contained'
					className='text-white mt-4'
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Вход...' : 'Войти'}
				</Button>
				<p className='body2 !font-normal text-secondary_text'>
					Вы впервые на нашей платформе?{' '}
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
