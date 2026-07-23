'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/Button'
import { saveCourse } from '@/src/lib/course-storage'

const CreateCoursePage = () => {
	const router = useRouter()
	const [courseName, setCourseName] = useState('')

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const title = courseName.trim()

		if (!title) return

		const course = saveCourse(title)
		router.push(`/courses/${course.metadata.slug}/content`)
	}

	return (
		<section className='max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
			<h1 className='text-xl font-semibold text-slate-900'>Создание нового курса</h1>
			<form className='mt-6 space-y-5' onSubmit={handleSubmit}>
				<div>
					<label htmlFor='course-name' className='mb-2 block text-sm font-medium text-slate-700'>
						Название курса
					</label>
					<input
						id='course-name'
						name='courseName'
						type='text'
						required
						value={courseName}
						onChange={(event) => setCourseName(event.target.value)}
						className='h-11 w-full rounded-lg border border-slate-300 px-3 text-slate-900 placeholder:text-slate-400 focus:border-color_brand_primary'
						placeholder='Введите название курса'
					/>
				</div>
				<Button type='submit'>Создать курс</Button>
			</form>
		</section>
	)
}

export default CreateCoursePage
