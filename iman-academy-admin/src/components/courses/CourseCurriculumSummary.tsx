'use client'

import Link from 'next/link'
import { Button } from '@/src/components/ui/Button'
import type { Module } from '@/src/types/course-types'

type CourseCurriculumSummaryProps = {
	courseId: string
	modules: Module[]
	isLoading?: boolean
}

export const CourseCurriculumSummary = ({
	courseId,
	modules,
	isLoading,
}: CourseCurriculumSummaryProps) => {
	const totalSubModules = modules.reduce(
		(sum, mod) => sum + (mod.subModules?.length ?? 0),
		0
	)

	return (
		<div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
			<div className='flex items-center justify-between border-b border-slate-100 pb-4'>
				<div>
					<h2 className='text-lg font-bold text-slate-900'>Учебная программа</h2>
					<p className='mt-0.5 text-xs text-slate-500'>
						{modules.length} {modules.length === 1 ? 'модуль' : 'модулей'} •{' '}
						{totalSubModules} {totalSubModules === 1 ? 'урок' : 'уроков'}
					</p>
				</div>
				<div className='flex gap-2'>
					<Link href={`/courses/${courseId}/content/edit`}>
						<Button size='sm' variant='outlined'>
							Редактировать структуру
						</Button>
					</Link>
					<Link href={`/courses/${courseId}/content`}>
						<Button size='sm'>Все материалы</Button>
					</Link>
				</div>
			</div>

			{isLoading ? (
				<div className='py-8 text-center text-sm text-slate-500'>
					Загрузка программы курса...
				</div>
			) : modules.length === 0 ? (
				<div className='py-8 text-center'>
					<p className='text-sm text-slate-500'>
						В этом курсе пока нет добавленных модулей.
					</p>
					<div className='mt-3'>
						<Link href={`/courses/${courseId}/content/edit`}>
							<Button size='sm'>Добавить первые модули</Button>
						</Link>
					</div>
				</div>
			) : (
				<div className='mt-4 divide-y divide-slate-100'>
					{modules.slice(0, 5).map((module, index) => {
						const subModulesCount = module.subModules?.length ?? 0

						return (
							<div
								key={module.id}
								className='flex items-center justify-between py-3 hover:bg-slate-50/50 px-2 rounded-lg transition-colors'
							>
								<div className='flex items-center gap-3 min-w-0'>
									<span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700'>
										{index + 1}
									</span>
									<span className='text-sm font-medium text-slate-900 truncate'>
										{module.title}
									</span>
								</div>
								<div className='flex items-center gap-3 shrink-0 text-xs text-slate-500'>
									<span>
										{subModulesCount}{' '}
										{subModulesCount === 1 ? 'подмодуль' : 'подмодулей'}
									</span>
									<Link
										href={`/courses/${courseId}/content`}
										className='text-color_brand_primary hover:underline font-medium'
									>
										Перейти →
									</Link>
								</div>
							</div>
						)
					})}

					{modules.length > 5 && (
						<div className='pt-3 text-center'>
							<Link
								href={`/courses/${courseId}/content`}
								className='text-xs font-medium text-color_brand_primary hover:underline'
							>
								Показать еще {modules.length - 5} модулей →
							</Link>
						</div>
					)}
				</div>
			)}
		</div>
	)
}