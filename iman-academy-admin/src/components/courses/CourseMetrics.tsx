'use client'

import type { ContentStatus } from '@/src/types/course-types'

type CourseMetricsProps = {
	stats: {
		total: number
		published: number
		drafts: number
		archived: number
	}
	statusFilter: 'all' | ContentStatus
	onStatusFilterChange: (status: 'all' | ContentStatus) => void
}

export const CourseMetrics = ({
	stats,
	statusFilter,
	onStatusFilterChange,
}: CourseMetricsProps) => {
	return (
		<div className='grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4'>
			<button
				type='button'
				onClick={() => onStatusFilterChange('all')}
				className={`rounded-xl border p-4 text-left transition-all ${
					statusFilter === 'all'
						? 'border-color_brand_primary bg-emerald-50/40 ring-1 ring-color_brand_primary'
						: 'border-slate-200 bg-white hover:border-slate-300'
				}`}
			>
				<p className='text-xs font-medium text-slate-500'>Все курсы</p>
				<p className='mt-1 text-2xl font-bold text-slate-900'>{stats.total}</p>
			</button>
			<button
				type='button'
				onClick={() => onStatusFilterChange('published')}
				className={`rounded-xl border p-4 text-left transition-all ${
					statusFilter === 'published'
						? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500'
						: 'border-slate-200 bg-white hover:border-slate-300'
				}`}
			>
				<p className='text-xs font-medium text-emerald-700'>Опубликовано</p>
				<p className='mt-1 text-2xl font-bold text-emerald-700'>{stats.published}</p>
			</button>
			<button
				type='button'
				onClick={() => onStatusFilterChange('draft')}
				className={`rounded-xl border p-4 text-left transition-all ${
					statusFilter === 'draft'
						? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
						: 'border-slate-200 bg-white hover:border-slate-300'
				}`}
			>
				<p className='text-xs font-medium text-amber-700'>Черновики</p>
				<p className='mt-1 text-2xl font-bold text-amber-700'>{stats.drafts}</p>
			</button>
			<button
				type='button'
				onClick={() => onStatusFilterChange('archived')}
				className={`rounded-xl border p-4 text-left transition-all ${
					statusFilter === 'archived'
						? 'border-slate-500 bg-slate-100 ring-1 ring-slate-500'
						: 'border-slate-200 bg-white hover:border-slate-300'
				}`}
			>
				<p className='text-xs font-medium text-slate-600'>В архиве</p>
				<p className='mt-1 text-2xl font-bold text-slate-700'>{stats.archived}</p>
			</button>
		</div>
	)
}