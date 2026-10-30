'use client'

import { Button } from '@/src/components/ui/Button'
import type { Course } from '@/src/types/course-types'

type CourseDeleteModalProps = {
	course: Course | null
	isDeleting: boolean
	onClose: () => void
	onConfirm: () => void
}

export const CourseDeleteModal = ({
	course,
	isDeleting,
	onClose,
	onConfirm,
}: CourseDeleteModalProps) => {
	if (!course) return null

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs'>
			<div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
				<h3 className='text-lg font-bold text-slate-900'>Удалить курс?</h3>
				<p className='mt-2 text-sm text-slate-600'>
					Вы уверены, что хотите удалить курс{' '}
					<span className='font-semibold text-slate-900'>«{course.title}»</span>? Это
					действие удалит все связанные модули и уроки.
				</p>
				<div className='mt-6 flex justify-end gap-3'>
					<Button variant='outlined' disabled={isDeleting} onClick={onClose}>
						Отмена
					</Button>
					<button
						type='button'
						disabled={isDeleting}
						onClick={onConfirm}
						className='rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors'
					>
						{isDeleting ? 'Удаление...' : 'Да, удалить курс'}
					</button>
				</div>
			</div>
		</div>
	)
}