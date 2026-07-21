'use client'

import { useRouter } from 'next/navigation'
import type { Course } from '../types/course-types'
import { cn } from '../lib/cn'

type EditorSyllabusNavigatorProps = {
	course: Course
	activeSubmoduleId: string
	hasUnsavedChanges: boolean
	onDiscardDraft: () => void
}

export const EditorSyllabusNavigator = ({
	course,
	activeSubmoduleId,
	hasUnsavedChanges,
	onDiscardDraft,
}: EditorSyllabusNavigatorProps) => {
	const router = useRouter()
	const modules = [...course.modules].sort((a, b) => a.metadata.order - b.metadata.order)

	const navigateTo = (href: string) => {
		if (hasUnsavedChanges && !window.confirm('Несохранённые изменения будут потеряны. Перейти к другому подразделу?')) return
		if (hasUnsavedChanges) onDiscardDraft()
		router.push(href)
	}

	return (
		<aside className='w-64 shrink-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm'>
			<p className='px-3 pb-3 text-xs font-semibold uppercase tracking-wide text-slate-500'>
				Содержание курса
			</p>
			<nav aria-label='Навигация по содержанию курса'>
				<ul className='space-y-3'>
					{modules.map((module) => {
						const subModules = [...module.subModules].sort((a, b) => a.metadata.order - b.metadata.order)
						return (
							<li key={module.id}>
								<p className='px-3 text-base font-bold text-slate-500'>
									{module.metadata.order}. {module.metadata.title}
								</p>
								<ul className='mt-1 space-y-1 pl-4'>
									{subModules.map((subModule) => {
										const isActive = subModule.id === activeSubmoduleId
										return (
											<li key={subModule.id}>
												<button
													type='button'
												onClick={() => navigateTo(`/edit-lesson/${subModule.id}/step/1`)}
													className={cn(
														'w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900',
														isActive && 'bg-color_brand_primary text-white hover:bg-color_brand_primary hover:text-white'
													)}
												>
													{subModule.metadata.order}. {subModule.metadata.title}
												</button>
											</li>
										)
									})}
								</ul>
							</li>
						)
					})}
				</ul>
			</nav>
		</aside>
	)
}
