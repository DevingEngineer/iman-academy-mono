'use client'

import { Button } from '@/src/components/UI/Button'
import { useState } from 'react'

export const PaymentForm = () => {
	const [paymentData, setPaymentData] = useState({
		fullName: '',
		email: '',
		cardNumber: '',
		tariff: '',
		month: '',
		year: '',
		cvc: '',
	})
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setPaymentData((prev) => ({ ...prev, [name]: value }))
	}
	const submitHandler = (e: React.FormEvent) => {
		e.preventDefault()
		alert(JSON.stringify(paymentData, null, 2))
		console.log(paymentData)
	}

	return (
		<form onSubmit={submitHandler}>
			<div className='flex w-full gap-6 w550:flex-col w550:gap-0'>
				<label className='mb-4 flex flex-col body3 max-w-[396px] w-full w550:max-w-full'>
					<span className='pb-1'>Имя и фамилия</span>
					<input
						name='fullName'
						onChange={handleChange}
						className='border border-border_devider p-3 rounded-lg text-[14px]'
						type='text'
					/>
				</label>
				<label className='mb-4 flex flex-col body3 max-w-[396px] w-full w550:max-w-full'>
					<span className='pb-1'>Email</span>
					<input
						name='email'
						onChange={handleChange}
						className='border border-border_devider p-3 rounded-lg text-[14px]'
						type='email'
					/>
				</label>
			</div>
			<div className='flex w-full gap-6 w550:flex-col w550:gap-0'>
				<label className='mb-4 flex flex-col body3 max-w-[396px] w-full w550:max-w-full'>
					<span className='pb-1'>Номер карты</span>
					<input
						name='cardNumber'
						onChange={handleChange}
						className='border border-border_devider p-3 rounded-lg text-[14px]'
						type='text'
					/>
					<p className='text-[10px]'>
						Платить обрабатывает защищённый провайдер. Мы не храним данные
						карты
					</p>
				</label>
				<label className='mb-4 flex flex-col body3 max-w-[396px] w-full w550:max-w-full'>
					<span className='pb-1'>Тариф</span>
					<input
						name='tariff'
						onChange={handleChange}
						className='border border-border_devider p-3 rounded-lg text-[14px]'
						type='text'
					/>
				</label>
			</div>
			<div className='flex w-full gap-6 w550:flex-col w550:gap-0'>
				<label className='mb-4 flex flex-col body3 max-w-[396px] w-full w550:max-w-full'>
					<span className='pb-1'>Месяц</span>
					<input
						name='month'
						onChange={handleChange}
						className='border border-border_devider p-3 rounded-lg text-[14px]'
						type='text'
					/>
				</label>
				<label className='mb-4 flex flex-col body3 max-w-[396px] w-full w550:max-w-full'>
					<span className='pb-1'>Год</span>
					<input
						name='year'
						onChange={handleChange}
						className='border border-border_devider p-3 rounded-lg text-[14px]'
						type='text'
					/>
				</label>
			</div>
			<div className='flex w-full gap-6 w550:flex-col w550:gap-0'>
				<label className='mb-4 flex flex-col body3 max-w-[396px] w-full w550:max-w-full'>
					<span className='pb-1'>CVC</span>
					<input
						name='cvc'
						onChange={handleChange}
						className='border border-border_devider p-3 rounded-lg text-[14px]'
						type='text'
					/>
				</label>
			</div>
			<Button
				type='submit'
				variant='contained'
				className='px-5 max-h-[44px]'
			>
				Оплатить курс
			</Button>
		</form>
	)
}
