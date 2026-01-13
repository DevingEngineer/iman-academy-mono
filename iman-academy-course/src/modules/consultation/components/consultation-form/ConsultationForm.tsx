'use client'

import { Button } from '@/src/components/UI/Button'
import { Link } from '@/src/i18n/navigation'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

export const COUNTRIES = {
	ru: {
		label: 'RU',
		countryCode: 'RU',
	},
	en: {
		label: 'EN',
		countryCode: 'US',
	},
} as const

export type Locale = keyof typeof COUNTRIES

export const ConsultationForm = () => {
	return (
		<form
			onSubmit={(e) => e.preventDefault()}
			className='bg-system_surface_card p-[30px] rounded-[20px]'
		>
			<div className=''>
				{/* Имя Фамилия */}
				<input
					type='text'
					placeholder='Имя Фамилия'
					className='bg-background_light w-full h-14 rounded-2xl px-5 text-gray-700 placeholder-gray-400 focus:outline-none'
				/>

				{/* Телефон */}
				<div className='flex gap-4 my-5'>
					<div className='w-[150px]'>
						<PhoneInput
							country={'kg'}
							enableSearch
							inputStyle={{
								width: '100%',
								height: '56px',
								borderRadius: '16px',
								border: 'none',
								background: '#FBF9F6',
								pointerEvents: 'none',
							}}
							buttonStyle={{
								border: 'none',
								borderRadius: '16px 0 0 16px',
								background: '#FBF9F6',
							}}
						/>
					</div>

					<input
						type='number'
						placeholder='Номер телефона'
						className='bg-background_light flex-1 h-14 rounded-2xl px-5 text-gray-700 placeholder-gray-400 focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
					/>
				</div>

				{/* Email */}
				<input
					type='email'
					placeholder='Email'
					className='bg-background_light w-full h-14 rounded-2xl px-5 text-gray-700 placeholder-gray-400 focus:outline-none'
				/>
			</div>

			{/* Чекбокс */}
			<div className='flex items-start gap-3 mt-6 text-sm text-gray-700'>
				<input type='checkbox' className='mt-1 h-4 w-4 rounded' />
				<p>
					Я согласен получать рассылку и ознакомлен с &nbsp;
					<Link href='#' className='text-blue-600 underline'>
						согласием на получение рекламной рассылки
					</Link>
				</p>
			</div>

			{/* Кнопка — ОТДЕЛЬНО */}
			<Button type='submit' variant='contained' className='w-full mt-7 mb-6'>
				Отправить заявку
			</Button>

			{/* Подвал */}
			<p className='text-sm text-gray-500 mt-4'>
				Нажимая кнопку, я
				<a href='#' className='text-blue-600 underline'>
					&nbsp;соглашаюсь&nbsp;
				</a>
				на
				<a href='#' className='text-blue-600 underline'>
					&nbsp;обработку персональных данных&nbsp;
				</a>
				и с
				<a href='#' className='text-blue-600 underline'>
					&nbsp;публичной офертой
				</a>
			</p>
		</form>
	)
}
