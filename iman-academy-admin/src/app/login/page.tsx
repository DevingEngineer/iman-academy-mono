'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

import { Button } from '../../components/ui/Button'
import { login } from '../../auth'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)
        try {
            await login({ email, password })
            router.push('/')
        } catch (err: any) {
            const detail = err?.response?.data?.detail ?? err?.response?.data?.title
            setError(detail || 'Неверный email или пароль')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-color_bg_gray px-4'>
            <div className='w-full max-w-[400px] bg-color_bg_white border border-[#ADADAD] rounded-2xl px-8 py-10'>
                <div className='flex justify-center mb-8'>
                    <Image src='/logo/iman_course_logo.png' alt='logo' width={148} height={36} />
                </div>

                <h1 className='text-[22px] font-semibold text-color_text_primary text-center mb-1'>
                    Вход в аккаунт
                </h1>
                <p className='text-sm text-[#ADADAD] text-center mb-7'>
                    Введите данные, чтобы продолжить
                </p>

                <form onSubmit={handleSubmit} noValidate>
                    <div className='mb-4'>
                        <label
                            htmlFor='email'
                            className='block text-xs text-color_text_primary mb-1.5'
                        >
                            Email
                        </label>
                        <input
                            id='email'
                            type='email'
                            autoComplete='email'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='you@example.com'
                            className='w-full h-[44px] px-4 rounded-lg border border-[#ADADAD] bg-color_bg_white text-color_text_primary text-sm placeholder:text-[#ADADAD] focus:outline-none focus:border-color_text_primary transition-colors'
                        />
                    </div>

                    <div className='mb-2'>
                        <div className='flex items-center justify-between mb-1.5'>
                            <label htmlFor='password' className='block text-xs text-color_text_primary'>
                                Пароль
                            </label>
                            <a href='/forgot-password' className='text-xs text-[#ADADAD] hover:text-color_text_primary'>
                                Забыли пароль?
                            </a>
                        </div>
                        <input
                            id='password'
                            type='password'
                            autoComplete='current-password'
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='••••••••'
                            className='w-full h-[44px] px-4 rounded-lg border border-[#ADADAD] bg-color_bg_white text-color_text_primary text-sm placeholder:text-[#ADADAD] focus:outline-none focus:border-color_text_primary transition-colors'
                        />
                    </div>

                    <div role='alert' aria-live='polite' className='min-h-[1.25rem] mt-2 mb-1'>
                        {error && <p className='text-xs text-[#E5484D]'>{error}</p>}
                    </div>

                    <Button type='submit' disabled={isSubmitting} className='w-full h-[44px] mt-4'>
                        {isSubmitting ? 'Вход...' : 'Войти'}
                    </Button>
                </form>

                <p className='text-sm text-[#ADADAD] text-center mt-7'>
                    Нет аккаунта?{' '}
                    <a href='/register' className='text-color_text_primary hover:underline'>
                        Зарегистрироваться
                    </a>
                </p>
            </div>
        </div>
    )
}
