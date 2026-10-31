'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/src/components/ui/Button'
import { updateCourse } from '@/src/lib/course-storage'
import type { Course, ContentStatus, CourseLevel } from '@/src/types/course-types'

const statusLabels: Record<ContentStatus, { label: string; badge: string; dot: string }> = {
	published: {
		label: 'Опубликован',
		badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
		dot: 'bg-emerald-500',
	},
	draft: {
		label: 'Черновик',
		badge: 'bg-amber-50 text-amber-700 border-amber-200',
		dot: 'bg-amber-500',
	},
	archived: {
		label: 'В архиве',
		badge: 'bg-slate-100 text-slate-600 border-slate-200',
		dot: 'bg-slate-400',
	},
}

const levelLabels: Record<CourseLevel, string> = {
	beginner: 'Начинающий',
	intermediate: 'Средний',
	advanced: 'Продвинутый',
}

const languageLabels: Record<string, string> = {
	ru: 'Русский',
	ky: 'Кыргызча',
	kk: 'Кыргызча',
	en: 'English',
}

type CourseOverviewHeroProps = {
	course: Course
}

export const CourseOverviewHero = ({ course }: CourseOverviewHeroProps) => {
	const [copied, setCopied] = useState(false)
	const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

	const statusInfo = statusLabels[course.status] ?? statusLabels.draft

	const handleCopyLink = () => {
		const url = `${window.location.origin}/courses/${course.slug || course.id}`
		navigator.clipboard.writeText(url)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const handleStatusChange = (newStatus: ContentStatus) => {
		if (newStatus === course.status) return
		setIsUpdatingStatus(true)
		updateCourse({
			...course,
			status: newStatus,
			updatedAt: new Date().toISOString(),
		})
		setIsUpdatingStatus(false)
	}

	return (
		<div className='relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
			<div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
				{/* Thumbnail / Cover */}
				<div className='flex shrink-0 items-center justify-center'>
					{course.thumbnailUrl ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={course.thumbnailUrl}
							alt={course.title}
							className='h-36 w-full rounded-xl border border-slate-200 object-cover lg:w-56'
						/>
					) : (
						<div className='flex h-36 w-full items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-3xl font-bold text-slate-600 border border-slate-200 lg:w-56'>
							{course.title.slice(0, 2).toUpperCase()}
						</div>
					)}
				</div>

				{/* Course header information */}
				<div className='flex-1 min-w-0'>
					<div className='flex flex-wrap items-center gap-2'>
						<span
							className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusInfo.badge}`}
						>
							<span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
							{statusInfo.label}
						</span>

						<span className='rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600'>
							{levelLabels[course.level] ?? course.level}
						</span>

						<span className='rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600'>
							{languageLabels[course.language] ?? course.language.toUpperCase()}
						</span>
					</div>

					<h1 className='mt-2.5 text-2xl font-bold text-slate-900'>{course.title}</h1>

					<p className='mt-2 text-sm leading-relaxed text-slate-600'>
						{course.description || 'Описание еще не добавлено. Добавьте его в настройках курса.'}
					</p>

					{/* Meta pills */}
					<div className='mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500'>
						<div className='flex items-center gap-1.5'>
							<span className='font-medium text-slate-700'>URL:</span>
							<code className='rounded bg-slate-100 px-1.5 py-0.5 text-slate-800'>
								/courses/{course.slug || course.id}
							</code>
							<button
								type='button'
								onClick={handleCopyLink}
								className='text-color_brand_primary hover:underline ml-1 font-medium'
							>
								{copied ? 'Скопировано!' : 'Копировать'}
							</button>
						</div>

						{course.tags && course.tags.length > 0 && (
							<div className='flex flex-wrap items-center gap-1'>
								<span className='font-medium text-slate-700'>Теги:</span>
								{course.tags.map((tag) => (
									<span
										key={tag}
										className='rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 font-medium'
									>
										#{tag}
									</span>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Quick CTA Buttons */}
				<div className='flex flex-row flex-wrap lg:flex-col gap-2 shrink-0'>
					<Link href={`/courses/${course.id}/content`} className='w-full'>
						<Button className='w-full justify-center'>Содержание курса</Button>
					</Link>
					<Link href={`/courses/${course.id}/settings`} className='w-full'>
						<Button variant='outlined' className='w-full justify-center'>
							Настройки курса
						</Button>
					</Link>

					<div className='pt-1 w-full'>
						<label className='block text-[11px] font-medium text-slate-500 mb-1'>
							Быстрая смена статуса:
						</label>
						<select
							disabled={isUpdatingStatus}
							value={course.status}
							onChange={(e) => handleStatusChange(e.target.value as ContentStatus)}
							className='h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 hover:border-slate-300 focus:border-color_brand_primary focus:outline-none'
						>
							<option value='draft'>Черновик</option>
							<option value='published'>Опубликован</option>
							<option value='archived'>В архиве</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	)
}