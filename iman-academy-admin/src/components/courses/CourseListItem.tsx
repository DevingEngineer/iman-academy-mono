'use client'

import Link from 'next/link'
import { Button } from '@/src/components/ui/Button'
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

type CourseListItemProps = {
	course: Course
	isUpdating?: boolean
	onStatusChange: (status: ContentStatus) => void
	onDeleteClick: () => void
}

export const CourseListItem = ({
	course,
	isUpdating,
	onStatusChange,
	onDeleteClick,
}: CourseListItemProps) => {
	const statusInfo = statusLabels[course.status] ?? statusLabels.draft
	const modulesCount = course.modules?.length ?? 0

	return (
		<li className='flex flex-col gap-4 p-5 transition-colors hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between'>
			<div className='flex items-start gap-4 min-w-0 flex-1'>
				<div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-base font-bold text-slate-700 border border-slate-200'>
					{course.title.slice(0, 2).toUpperCase()}
				</div>
				<div className='min-w-0 flex-1'>
					<div className='flex flex-wrap items-center gap-2'>
						<Link
							href={`/courses/${course.id}/description`}
							className='text-base font-semibold text-slate-900 hover:text-color_brand_primary transition-colors truncate'
						>
							{course.title}
						</Link>
						<span
							className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusInfo.badge}`}
						>
							<span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
							{statusInfo.label}
						</span>
					</div>

					{course.description && (
						<p className='mt-1 text-sm text-slate-500 line-clamp-1'>
							{course.description}
						</p>
					)}

					<div className='mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500'>
						<span className='font-medium text-slate-700'>
							{levelLabels[course.level] ?? course.level}
						</span>
						<span>•</span>
						<span>{modulesCount} модулей</span>
						<span>•</span>
						<span>
							{course.price && course.price > 0
								? `${course.price.toLocaleString()} ${course.currency}`
								: 'Бесплатно'}
						</span>
						{course.tags && course.tags.length > 0 && (
							<>
								<span>•</span>
								<div className='flex flex-wrap gap-1'>
									{course.tags.slice(0, 3).map((tag) => (
										<span
											key={tag}
											className='rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600'
										>
											#{tag}
										</span>
									))}
									{course.tags.length > 3 && (
										<span className='text-[11px] text-slate-400'>
											+{course.tags.length - 3}
										</span>
									)}
								</div>
							</>
						)}
					</div>
				</div>
			</div>

			<div className='flex flex-wrap items-center gap-2 sm:shrink-0'>
				<select
					disabled={isUpdating}
					value={course.status}
					onChange={(e) => onStatusChange(e.target.value as ContentStatus)}
					className='h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 hover:border-slate-300 focus:border-color_brand_primary focus:outline-none'
					title='Изменить статус'
				>
					<option value='draft'>Черновик</option>
					<option value='published'>Опубликован</option>
					<option value='archived'>В архиве</option>
				</select>

				<Link href={`/courses/${course.id}/content`}>
					<Button size='sm' variant='outlined' className='text-xs'>
						Содержание
					</Button>
				</Link>

				<Link href={`/courses/${course.id}/settings`}>
					<Button size='sm' variant='outlined' className='text-xs'>
						Настройки
					</Button>
				</Link>

				<button
					type='button'
					onClick={onDeleteClick}
					className='h-8 rounded-lg px-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors'
					title='Удалить курс'
				>
					Удалить
				</button>
			</div>
		</li>
	)
}