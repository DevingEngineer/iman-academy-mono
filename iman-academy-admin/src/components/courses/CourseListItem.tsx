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
	onDeleteClick: () => void
}

export const CourseListItem = ({
	course,
	onDeleteClick,
}: CourseListItemProps) => {
	const statusInfo = statusLabels[course.status] ?? statusLabels.draft
	const modulesCount = course.modules?.length ?? 0

	return (
		<li className='group flex flex-col gap-4 p-5 transition-colors hover:bg-slate-50/80 sm:flex-row sm:items-center sm:justify-between'>
			<div className='flex items-start gap-4 min-w-0 flex-1'>
				{course.thumbnailUrl ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={course.thumbnailUrl}
						alt={course.title}
						className='h-14 w-20 shrink-0 rounded-xl border border-slate-200 object-cover'
					/>
				) : (
					<div className='flex h-14 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-sm font-bold text-slate-600 border border-slate-200'>
						{course.title.slice(0, 2).toUpperCase()}
					</div>
				)}

				<div className='min-w-0 flex-1'>
					<div className='flex flex-wrap items-center gap-2.5'>
						<Link
							href={`/courses/${course.id}/description`}
							className='text-base font-semibold text-slate-900 group-hover:text-color_brand_primary transition-colors truncate'
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

					<div className='mt-2 flex flex-wrap items-center gap-2.5 text-xs text-slate-500'>
						<span className='font-medium text-slate-700'>
							{levelLabels[course.level] ?? course.level}
						</span>
						<span>•</span>
						<span>{modulesCount} модулей</span>
						<span>•</span>
						<span className='font-medium text-slate-800'>
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

			<div className='flex items-center gap-2 sm:shrink-0'>
				<Link href={`/courses/${course.id}/description`}>
					<Button size='sm' variant='outlined' className='text-xs'>
						Обзор
					</Button>
				</Link>

				<Link href={`/courses/${course.id}/content`}>
					<Button size='sm' className='text-xs'>
						Содержание
					</Button>
				</Link>

				<button
					type='button'
					onClick={onDeleteClick}
					className='h-8 rounded-lg px-2 text-xs font-medium text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors'
					title='Удалить курс'
				>
					Удалить
				</button>
			</div>
		</li>
	)
}