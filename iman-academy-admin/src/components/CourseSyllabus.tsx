'use client'

import { useRouter } from 'next/navigation'
import { Button } from './ui/Button'
import { useCourses } from '../hooks/useCourses'

export const CourseSyllabus = ({ courseSlug }: { courseSlug: string }) => {
	const router = useRouter()
	const courses = useCourses()
	const cleanSlug = decodeURIComponent(courseSlug);

	const course = courses.find((item) => item.metadata.slug === cleanSlug)

	if (!course) return null

	const modules = [...course.modules].sort((a, b) => a.metadata.order - b.metadata.order)

	return (
		<div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
			<div className='flex items-center justify-between gap-4'>
				<div>
					<h2 className='text-lg font-semibold text-slate-900'>Содержание курса</h2>
					<p className='mt-2 text-sm text-slate-500'>Модули и подразделы курса.</p>
				</div>
				<Button onClick={() => router.push(`/courses/${courseSlug}/content/edit`)}>
					Редактировать содержание
				</Button>
			</div>

			{modules.length === 0 ? (
				<p className='mt-6 rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500'>
					В содержании пока нет модулей.
				</p>
			) : (
				<ol className='mt-6 space-y-4'>
					{modules.map((module) => {
						const subModules = [...module.subModules].sort(
							(a, b) => a.metadata.order - b.metadata.order
						)

						return (
							<li key={module.id} className='rounded-xl border border-slate-200 p-4'>
								<p className='font-semibold text-slate-900'>
									{module.metadata.order}. {module.metadata.title}
								</p>
								{subModules.length > 0 && (
									<ol className='mt-3 space-y-2 pl-5 text-sm text-slate-600'>
										{subModules.map((subModule) => (
											<li key={subModule.id} className='flex items-center justify-between gap-3'>
												<span>{subModule.metadata.order}. {subModule.metadata.title}</span>
												<Button
													size='sm'
													variant='outlined'
													onClick={() =>
														router.push(
															`/courses/edit-lesson/${subModule.id}/step/1`
														)
													}
												>
													Редактировать
												</Button>
											</li>
										))}
									</ol>
								)}
							</li>
						)
					})}
				</ol>
			)}
		</div>
	)
}
