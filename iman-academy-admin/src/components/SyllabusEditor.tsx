'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Course, Module } from '../types/course-types'
import { useCourses } from '../hooks/useCourses'
import { updateCourse } from '../lib/course-storage'
import { Button } from './ui/Button'

const createId = (prefix: string) =>
	`${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const normalizeOrders = (course: Course): Course => ({
	...course,
	modules: [...course.modules]
		.sort((a, b) => a.order - b.order)
		.map((module, moduleIndex) => ({
			...module,
			order: moduleIndex + 1,
			subModules: [...module.subModules]
				.sort((a, b) => a.order - b.order)
				.map((subModule, subModuleIndex) => ({
					...subModule,
		 			order: subModuleIndex + 1,
				})),
		})),
})

type EditorFormProps = {
	course: Course
	courseSlug: string
}

const SyllabusEditorForm = ({ course, courseSlug }: EditorFormProps) => {
	const router = useRouter()
	const [draft, setDraft] = useState(() => normalizeOrders(course))
	const [newModuleTitle, setNewModuleTitle] = useState('')
	const [newSubModuleTitles, setNewSubModuleTitles] = useState<Record<string, string>>({})

	const updateDraft = (updater: (current: Course) => Course) => {
		setDraft((current) => normalizeOrders(updater(current)))
	}

	const addModule = () => {
		const title = newModuleTitle.trim()
		if (!title) return

		updateDraft((current) => ({
			...current,
			modules: [
				...current.modules,
				{
					id: createId('module'),
					courseId: current.id,
					title, order: current.modules.length + 1, 
					status: 'draft',
					subModules: [],
				},
			],
		}))
		setNewModuleTitle('')
	}

	const addSubModule = (module: Module) => {
		const title = newSubModuleTitles[module.id]?.trim()
		if (!title) return

		updateDraft((current) => ({
			...current,
			modules: current.modules.map((item) =>
				item.id === module.id
					? {
							...item,
							subModules: [
								...item.subModules,
								{
									id: createId('submodule'),
									moduleId: item.id,
									title,
									order: item.subModules.length + 1,
									steps: [],
								},
							],
						}
					: item
			),
		}))
		setNewSubModuleTitles((current) => ({ ...current, [module.id]: '' }))
	}

	const moveModule = (index: number, direction: -1 | 1) => {
		const destination = index + direction
		if (destination < 0 || destination >= draft.modules.length) return

		updateDraft((current) => {
			const modules = [...current.modules]
			;[modules[index], modules[destination]] = [modules[destination], modules[index]]
			return { ...current, modules }
		})
	}

	const moveSubModule = (moduleId: string, index: number, direction: -1 | 1) => {
		updateDraft((current) => ({
			...current,
			modules: current.modules.map((module) => {
				if (module.id !== moduleId) return module
				const destination = index + direction
				if (destination < 0 || destination >= module.subModules.length) return module

				const subModules = [...module.subModules]
				;[subModules[index], subModules[destination]] = [
					subModules[destination],
					subModules[index],
				]
				return { ...module, subModules }
			}),
		}))
	}

	const save = () => {
		updateCourse({
			...normalizeOrders(draft),
			updatedAt: new Date().toISOString(),
			
		})
		router.push(`/courses/${courseSlug}/content`)
	}

	return (
		<section className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
			<div className='flex items-center justify-between gap-4'>
				<div>
					<h2 className='text-lg font-semibold text-slate-900'>Редактирование содержания</h2>
					<p className='mt-2 text-sm text-slate-500'>Добавляйте, переименовывайте и меняйте порядок модулей.</p>
				</div>
				<div className='flex gap-3'>
					<Button variant='outlined' onClick={() => router.push(`/courses/${courseSlug}/content`)}>
						Отмена
					</Button>
					<Button onClick={save}>Сохранить</Button>
				</div>
			</div>

			<div className='mt-6 flex gap-3'>
				<input
					value={newModuleTitle}
					onChange={(event) => setNewModuleTitle(event.target.value)}
					onKeyDown={(event) => event.key === 'Enter' && addModule()}
					placeholder='Название модуля'
					className='h-10 flex-1 rounded-lg border border-slate-300 px-3 text-sm focus:border-color_brand_primary'
				/>
				<Button onClick={addModule}>Добавить модуль</Button>
			</div>

			<div className='mt-6 space-y-4'>
				{draft.modules.map((module, moduleIndex) => (
					<div key={module.id} className='rounded-xl border border-slate-200 p-4'>
						<div className='flex items-center gap-2'>
							<span className='text-sm font-medium text-slate-500'>{module.order}.</span>
							<input
								value={module.title}
								onChange={(event) =>
									updateDraft((current) => ({
										...current,
										modules: current.modules.map((item) =>
											item.id === module.id
												? { ...item, title: event.target.value }
												: item
										),
									}))
								}
								className='h-10 flex-1 rounded-lg border border-slate-300 px-3 text-sm focus:border-color_brand_primary'
							/>
							<Button size='sm' onClick={() => moveModule(moduleIndex, -1)} disabled={moduleIndex === 0}>↑</Button>
							<Button size='sm' onClick={() => moveModule(moduleIndex, 1)} disabled={moduleIndex === draft.modules.length - 1}>↓</Button>
							<Button
								size='sm'
								variant='outlined'
								onClick={() => {
									if (window.confirm('Удалить модуль и все его подразделы?')) {
										updateDraft((current) => ({
											...current,
											modules: current.modules.filter((item) => item.id !== module.id),
										}))
									}
								}}
							>
								Удалить
							</Button>
						</div>

						<div className='mt-4 space-y-2 border-l-2 border-slate-100 pl-4'>
							{module.subModules.map((subModule, subModuleIndex) => (
								<div key={subModule.id} className='flex items-center gap-2'>
									<span className='text-xs text-slate-500'>{module.order}.{subModule.order}</span>
									<input
										value={subModule.title}
										onChange={(event) =>
											updateDraft((current) => ({
												...current,
												modules: current.modules.map((item) =>
													item.id === module.id
														? {
															...item,
															subModules: item.subModules.map((child) =>
																child.id === subModule.id
																	? { ...child, title: event.target.value }
																	: child
															),
														}
														: item
												),
											}))
										}
										className='h-9 flex-1 rounded-lg border border-slate-300 px-3 text-sm focus:border-color_brand_primary'
									/>
									<Button size='sm' onClick={() => moveSubModule(module.id, subModuleIndex, -1)} disabled={subModuleIndex === 0}>↑</Button>
									<Button size='sm' onClick={() => moveSubModule(module.id, subModuleIndex, 1)} disabled={subModuleIndex === module.subModules.length - 1}>↓</Button>
									<Button
										size='sm'
										variant='outlined'
										onClick={() => {
											if (window.confirm('Удалить подраздел?')) {
												updateDraft((current) => ({
													...current,
													modules: current.modules.map((item) =>
														item.id === module.id
															? { ...item, subModules: item.subModules.filter((child) => child.id !== subModule.id) }
															: item
													),
												}))
											}
										}}
									>
										Удалить
									</Button>
								</div>
							))}
							<div className='flex gap-2 pt-2'>
								<input
									value={newSubModuleTitles[module.id] ?? ''}
									onChange={(event) =>
										setNewSubModuleTitles((current) => ({ ...current, [module.id]: event.target.value }))
									}
									onKeyDown={(event) => event.key === 'Enter' && addSubModule(module)}
									placeholder='Название подраздела'
									className='h-9 flex-1 rounded-lg border border-slate-300 px-3 text-sm focus:border-color_brand_primary'
								/>
								<Button size='sm' onClick={() => addSubModule(module)}>Добавить подраздел</Button>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	)
}

export const SyllabusEditor = ({ courseSlug }: { courseSlug: string }) => {
	const courses = useCourses()
	const cleanSlug = decodeURIComponent(courseSlug);
	const course = courses.find((item) => item.slug === cleanSlug)

	if (!course) return <p className='text-sm text-slate-500'>Загрузка курса...</p>

	return <SyllabusEditorForm key={`${course.id}-${course.updatedAt}`} course={course} courseSlug={courseSlug} />
}
