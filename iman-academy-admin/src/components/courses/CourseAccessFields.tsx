'use client'

import { CourseTagsInput } from './CourseTagsInput'
import type { CourseLevel, ContentStatus } from '@/src/types/course-types'

type CourseAccessFieldsProps = {
	level: CourseLevel
	onLevelChange: (val: CourseLevel) => void
	language: string
	onLanguageChange: (val: string) => void
	isFree: boolean
	onIsFreeChange: (val: boolean) => void
	price: number
	onPriceChange: (val: number) => void
	currency: string
	onCurrencyChange: (val: string) => void
	status: ContentStatus
	onStatusChange: (val: ContentStatus) => void
	tags: string[]
	onTagsChange: (val: string[]) => void
}

export const CourseAccessFields = ({
	level,
	onLevelChange,
	language,
	onLanguageChange,
	isFree,
	onIsFreeChange,
	price,
	onPriceChange,
	currency,
	onCurrencyChange,
	status,
	onStatusChange,
	tags,
	onTagsChange,
}: CourseAccessFieldsProps) => {
	return (
		<div className='space-y-6'>
			<div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5'>
				<h2 className='text-base font-semibold text-slate-900 border-b border-slate-100 pb-3'>
					2. Параметры и доступ
				</h2>

				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
					<div>
						<label className='mb-1.5 block text-sm font-medium text-slate-700'>
							Уровень сложности
						</label>
						<select
							value={level}
							onChange={(e) => onLevelChange(e.target.value as CourseLevel)}
							className='h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-color_brand_primary focus:outline-none'
						>
							<option value='beginner'>Начинающий (Beginner)</option>
							<option value='intermediate'>Средний (Intermediate)</option>
							<option value='advanced'>Продвинутый (Advanced)</option>
						</select>
					</div>

					<div>
						<label className='mb-1.5 block text-sm font-medium text-slate-700'>
							Язык курса
						</label>
						<select
							value={language}
							onChange={(e) => onLanguageChange(e.target.value)}
							className='h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-color_brand_primary focus:outline-none'
						>
							<option value='ru'>Русский</option>
							<option value='ky'>Кыргызча</option>
							<option value='en'>English</option>
						</select>
					</div>
				</div>

				<div className='pt-2'>
					<label className='mb-2 block text-sm font-medium text-slate-700'>
						Стоимость курса
					</label>
					<div className='flex gap-4'>
						<label className='flex items-center gap-2 cursor-pointer'>
							<input
								type='radio'
								name='pricingType'
								checked={isFree}
								onChange={() => onIsFreeChange(true)}
								className='h-4 w-4 text-color_brand_primary'
							/>
							<span className='text-sm text-slate-800'>Бесплатный курс</span>
						</label>
						<label className='flex items-center gap-2 cursor-pointer'>
							<input
								type='radio'
								name='pricingType'
								checked={!isFree}
								onChange={() => onIsFreeChange(false)}
								className='h-4 w-4 text-color_brand_primary'
							/>
							<span className='text-sm text-slate-800'>Платный курс</span>
						</label>
					</div>

					{!isFree && (
						<div className='mt-3 flex gap-3'>
							<input
								type='number'
								min='0'
								step='100'
								value={price || ''}
								onChange={(e) => onPriceChange(Number(e.target.value))}
								placeholder='Цена, например 15000'
								className='h-11 flex-1 rounded-lg border border-slate-300 px-3.5 text-sm text-slate-900 focus:border-color_brand_primary focus:outline-none'
							/>
							<select
								value={currency}
								onChange={(e) => onCurrencyChange(e.target.value)}
								className='h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-color_brand_primary focus:outline-none'
							>
								<option value='KGS'>KGS (сом)</option>
								<option value='USD'>USD ($)</option>
								<option value='RUB'>RUB (₽)</option>
							</select>
						</div>
					)}
				</div>
			</div>

			<div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5'>
				<h2 className='text-base font-semibold text-slate-900 border-b border-slate-100 pb-3'>
					3. Теги и статус
				</h2>

				<CourseTagsInput tags={tags} onTagsChange={onTagsChange} />

				<div>
					<label className='mb-1.5 block text-sm font-medium text-slate-700'>
						Статус курса
					</label>
					<select
						value={status}
						onChange={(e) => onStatusChange(e.target.value as ContentStatus)}
						className='h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-color_brand_primary focus:outline-none'
					>
						<option value='draft'>Черновик (Draft)</option>
						<option value='published'>Опубликован (Published)</option>
						<option value='archived'>В архиве (Archived)</option>
					</select>
				</div>
			</div>
		</div>
	)
}