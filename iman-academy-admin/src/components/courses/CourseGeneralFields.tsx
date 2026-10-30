'use client'

import { slugify } from '@/src/lib/course-storage'

type CourseGeneralFieldsProps = {
	title: string
	onTitleChange: (val: string) => void
	slug: string
	onSlugChange: (val: string) => void
	description: string
	onDescriptionChange: (val: string) => void
	thumbnailUrl: string
	onThumbnailUrlChange: (val: string) => void
	showAutoSlugBtn?: boolean
}

export const CourseGeneralFields = ({
	title,
	onTitleChange,
	slug,
	onSlugChange,
	description,
	onDescriptionChange,
	thumbnailUrl,
	onThumbnailUrlChange,
	showAutoSlugBtn = true,
}: CourseGeneralFieldsProps) => {
	return (
		<div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5'>
			<h2 className='text-base font-semibold text-slate-900 border-b border-slate-100 pb-3'>
				1. Основная информация
			</h2>

			<div>
				<label htmlFor='title' className='mb-1.5 block text-sm font-medium text-slate-700'>
					Название курса <span className='text-red-500'>*</span>
				</label>
				<input
					id='title'
					type='text'
					required
					value={title}
					onChange={(e) => onTitleChange(e.target.value)}
					placeholder='Например: Основы Frontend разработки на React'
					className='h-11 w-full rounded-lg border border-slate-300 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-color_brand_primary focus:outline-none'
				/>
			</div>

			<div>
				<div className='flex items-center justify-between mb-1.5'>
					<label htmlFor='slug' className='block text-sm font-medium text-slate-700'>
						URL-идентификатор (slug)
					</label>
					{showAutoSlugBtn && (
						<button
							type='button'
							onClick={() => onSlugChange(slugify(title))}
							className='text-xs text-color_brand_primary hover:underline'
						>
							Сгенерировать из названия
						</button>
					)}
				</div>
				<div className='flex items-center rounded-lg border border-slate-300 px-3 text-sm text-slate-500 focus-within:border-color_brand_primary'>
					<span className='select-none text-slate-400'>courses/</span>
					<input
						id='slug'
						type='text'
						value={slug}
						onChange={(e) => onSlugChange(e.target.value)}
						placeholder='react-basics'
						className='h-10 flex-1 border-0 bg-transparent px-1 text-slate-900 focus:outline-none'
					/>
				</div>
			</div>

			<div>
				<label htmlFor='description' className='mb-1.5 block text-sm font-medium text-slate-700'>
					Краткое описание курса
				</label>
				<textarea
					id='description'
					rows={3}
					value={description}
					onChange={(e) => onDescriptionChange(e.target.value)}
					placeholder='Опишите цели программы, результаты обучения и для кого предназначен курс...'
					className='w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-color_brand_primary focus:outline-none'
				/>
			</div>

			<div>
				<label htmlFor='thumbnailUrl' className='mb-1.5 block text-sm font-medium text-slate-700'>
					Ссылка на обложку (Thumbnail URL)
				</label>
				<input
					id='thumbnailUrl'
					type='url'
					value={thumbnailUrl}
					onChange={(e) => onThumbnailUrlChange(e.target.value)}
					placeholder='https://images.unsplash.com/...'
					className='h-11 w-full rounded-lg border border-slate-300 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-color_brand_primary focus:outline-none'
				/>

				{thumbnailUrl.trim() && (
					<div className='mt-3 flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3'>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={thumbnailUrl.trim()}
							alt='Превью обложки'
							className='h-16 w-24 rounded-lg object-cover border border-slate-200'
							onError={(e) => {
								(e.target as HTMLElement).style.display = 'none'
							}}
						/>
						<div className='flex-1 text-xs text-slate-500 truncate'>
							<p className='font-medium text-slate-700'>Предпросмотр обложки</p>
							<p className='truncate text-[11px] text-slate-400'>{thumbnailUrl}</p>
						</div>
						<button
							type='button'
							onClick={() => onThumbnailUrlChange('')}
							className='text-xs text-red-500 hover:text-red-700'
						>
							Удалить
						</button>
					</div>
				)}
			</div>
		</div>
	)
}