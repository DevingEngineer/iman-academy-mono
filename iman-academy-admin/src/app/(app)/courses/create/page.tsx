'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/src/components/ui/Button'
import { createCourseAsync, slugify } from '@/src/lib/course-storage'
import { CourseGeneralFields } from '@/src/components/courses/CourseGeneralFields'
import { CourseAccessFields } from '@/src/components/courses/CourseAccessFields'
import type { CourseLevel, ContentStatus } from '@/src/types/course-types'

const CreateCoursePage = () => {
	const router = useRouter()

	const [title, setTitle] = useState('')
	const [slug, setSlug] = useState('')
	const [isCustomSlug, setIsCustomSlug] = useState(false)
	const [description, setDescription] = useState('')
	const [thumbnailUrl, setThumbnailUrl] = useState('')
	const [level, setLevel] = useState<CourseLevel>('beginner')
	const [language, setLanguage] = useState('ru')
	const [isFree, setIsFree] = useState(true)
	const [price, setPrice] = useState<number>(0)
	const [currency, setCurrency] = useState('KGS')
	const [status, setStatus] = useState<ContentStatus>('draft')
	const [tags, setTags] = useState<string[]>([])

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const handleTitleChange = (val: string) => {
		setTitle(val)
		if (!isCustomSlug) {
			setSlug(slugify(val))
		}
	}

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const trimmedTitle = title.trim()
		if (!trimmedTitle) {
			setErrorMessage('Пожалуйста, введите название курса')
			return
		}

		setIsSubmitting(true)
		setErrorMessage(null)

		try {
			const finalSlug = slug.trim() ? slugify(slug) : slugify(trimmedTitle)
			const created = await createCourseAsync({
				title: trimmedTitle,
				slug: finalSlug,
				description: description.trim(),
				thumbnailUrl: thumbnailUrl.trim() || undefined,
				level,
				language,
				price: isFree ? 0 : Number(price) || 0,
				currency,
				status,
				tags,
			})

			router.push(`/courses/${created.id}/content`)
		} catch (err: any) {
			console.error('Ошибка создания курса', err)
			setErrorMessage(err?.message || 'Произошла ошибка при создании курса. Попробуйте еще раз.')
			setIsSubmitting(false)
		}
	}

	return (
		<div className='mx-auto max-w-3xl space-y-6 pb-12'>
			<div>
				<nav className='mb-2 flex items-center gap-2 text-sm text-slate-500'>
					<Link href='/courses' className='hover:text-slate-900'>
						Курсы
					</Link>
					<span>/</span>
					<span className='text-slate-900 font-medium'>Создание курса</span>
				</nav>
				<h1 className='text-2xl font-bold text-slate-900'>Создание нового курса</h1>
				<p className='mt-1 text-sm text-slate-500'>
					Заполните основную информацию о программе. Модули и уроки вы сможете добавить сразу после создания.
				</p>
			</div>

			{errorMessage && (
				<div className='rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
					{errorMessage}
				</div>
			)}

			<form onSubmit={handleSubmit} className='space-y-6'>
				<CourseGeneralFields
					title={title}
					onTitleChange={handleTitleChange}
					slug={slug}
					onSlugChange={(val) => {
						setIsCustomSlug(true)
						setSlug(val)
					}}
					description={description}
					onDescriptionChange={setDescription}
					thumbnailUrl={thumbnailUrl}
					onThumbnailUrlChange={setThumbnailUrl}
				/>

				<CourseAccessFields
					level={level}
					onLevelChange={setLevel}
					language={language}
					onLanguageChange={setLanguage}
					isFree={isFree}
					onIsFreeChange={setIsFree}
					price={price}
					onPriceChange={setPrice}
					currency={currency}
					onCurrencyChange={setCurrency}
					status={status}
					onStatusChange={setStatus}
					tags={tags}
					onTagsChange={setTags}
				/>

				<div className='flex items-center justify-end gap-3 pt-2'>
					<Link href='/courses'>
						<Button type='button' variant='outlined' disabled={isSubmitting}>
							Отмена
						</Button>
					</Link>
					<Button type='submit' disabled={isSubmitting}>
						{isSubmitting ? 'Создание курса...' : 'Создать курс и перейти к содержанию'}
					</Button>
				</div>
			</form>
		</div>
	)
}

export default CreateCoursePage
