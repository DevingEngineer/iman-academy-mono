'use client'

import { Button } from '@/src/components/ui/Button'
import type { ContentStatus } from '@/src/types/course-types'

type CourseDangerZoneProps = {
	status: ContentStatus
	onArchive: () => void
	onDeleteClick: () => void
}

export const CourseDangerZone = ({
	status,
	onArchive,
	onDeleteClick,
}: CourseDangerZoneProps) => {
	return (
		<div className='rounded-2xl border border-red-200 bg-red-50/25 p-6 shadow-sm space-y-4'>
			<h3 className='text-base font-bold text-red-900 border-b border-red-100 pb-2'>
				Опасная зона
			</h3>

			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
				<div>
					<p className='text-sm font-semibold text-slate-900'>Архивировать курс</p>
					<p className='text-xs text-slate-500'>
						Курс перестанет быть доступен студентам в каталоге, но вся программа и материалы сохранятся.
					</p>
				</div>
				<Button
					type='button'
					variant='outlined'
					size='sm'
					onClick={onArchive}
					disabled={status === 'archived'}
				>
					{status === 'archived' ? 'Уже в архиве' : 'В архив'}
				</Button>
			</div>

			<div className='border-t border-red-100 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
				<div>
					<p className='text-sm font-semibold text-red-700'>Удалить курс безвозвратно</p>
					<p className='text-xs text-slate-500'>
						Удаляет курс, все модули, уроки и материалы без возможности восстановления.
					</p>
				</div>
				<button
					type='button'
					onClick={onDeleteClick}
					className='rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors'
				>
					Удалить курс
				</button>
			</div>
		</div>
	)
}