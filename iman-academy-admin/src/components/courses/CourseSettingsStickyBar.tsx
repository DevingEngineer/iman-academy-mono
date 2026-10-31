'use client'

import { Button } from '@/src/components/ui/Button'

type CourseSettingsStickyBarProps = {
	isDirty: boolean
	isSaving: boolean
	onReset: () => void
	onSave: () => void
}

export const CourseSettingsStickyBar = ({
	isDirty,
	isSaving,
	onReset,
	onSave,
}: CourseSettingsStickyBarProps) => {
	if (!isDirty) return null

	return (
		<div className='fixed bottom-6 left-1/2 z-40 -translate-x-1/2 w-[90%] max-w-2xl rounded-2xl border border-slate-200 bg-white/95 px-6 py-3.5 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-4 duration-200 flex items-center justify-between gap-4'>
			<div className='flex items-center gap-2'>
				<span className='h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse' />
				<p className='text-sm font-medium text-slate-800'>Есть несохраненные изменения</p>
			</div>
			<div className='flex items-center gap-2.5'>
				<button
					type='button'
					onClick={onReset}
					disabled={isSaving}
					className='rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors'
				>
					Сбросить
				</button>
				<Button
					type='button'
					size='sm'
					disabled={isSaving}
					onClick={onSave}
					className='shadow-sm'
				>
					{isSaving ? 'Сохранение...' : 'Сохранить изменения'}
				</Button>
			</div>
		</div>
	)
}