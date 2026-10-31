'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/src/components/ui/PageHeader'
import { Button } from '@/src/components/ui/Button'
import { PlusIcon } from '@/src/components/icons/PlusIcon'
import { useCourses } from '@/src/hooks/useCourses'
import { deleteCourse } from '@/src/lib/course-storage'
import { CourseListItem } from '@/src/components/courses/CourseListItem'
import { CourseDeleteModal } from '@/src/components/courses/CourseDeleteModal'
import { CourseMetrics } from '@/src/components/courses/CourseMetrics'
import { CourseFilterBar } from '@/src/components/courses/CourseFilterBar'
import { CourseEmptyState } from '@/src/components/courses/CourseEmptyState'
import type { Course, ContentStatus, CourseLevel } from '@/src/types/course-types'

const CoursesPage = () => {
	const courses = useCourses()
	const [searchQuery, setSearchQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState<'all' | ContentStatus>('all')
	const [levelFilter, setLevelFilter] = useState<'all' | CourseLevel>('all')
	const [sortBy, setSortBy] = useState<'updated' | 'title' | 'price'>('updated')

	const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
	const [isDeleting, setIsDeleting] = useState(false)

	const stats = useMemo(() => {
		const total = courses.length
		const published = courses.filter((c) => c.status === 'published').length
		const drafts = courses.filter((c) => c.status === 'draft').length
		const archived = courses.filter((c) => c.status === 'archived').length
		return { total, published, drafts, archived }
	}, [courses])

	const filteredCourses = useMemo(() => {
		return courses
			.filter((course) => {
				const query = searchQuery.toLowerCase().trim()
				if (query) {
					const titleMatch = course.title.toLowerCase().includes(query)
					const slugMatch = course.slug.toLowerCase().includes(query)
					const descMatch = (course.description ?? '').toLowerCase().includes(query)
					const tagsMatch = course.tags?.some((t) => t.toLowerCase().includes(query))
					if (!titleMatch && !slugMatch && !descMatch && !tagsMatch) return false
				}

				if (statusFilter !== 'all' && course.status !== statusFilter) {
					return false
				}

				if (levelFilter !== 'all' && course.level !== levelFilter) {
					return false
				}

				return true
			})
			.sort((a, b) => {
				if (sortBy === 'title') {
					return a.title.localeCompare(b.title)
				}
				if (sortBy === 'price') {
					return (a.price ?? 0) - (b.price ?? 0)
				}
				const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime()
				const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime()
				return dateB - dateA
			})
	}, [courses, searchQuery, statusFilter, levelFilter, sortBy])

	const handleDeleteConfirm = async () => {
		if (!courseToDelete) return
		try {
			setIsDeleting(true)
			await deleteCourse(courseToDelete.id)
			setCourseToDelete(null)
		} catch (error) {
			console.error('Ошибка при удалении курса', error)
			alert('Не удалось удалить курс. Попробуйте ещё раз.')
		} finally {
			setIsDeleting(false)
		}
	}

	const resetFilters = () => {
		setSearchQuery('')
		setStatusFilter('all')
		setLevelFilter('all')
	}

	return (
		<div className='space-y-6'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<PageHeader
					title='Управление курсами'
					description='Создание, редактирование программ, настройки публикаций и аналитика курсов.'
				/>
				<Link href='/courses/create'>
					<Button className='flex items-center gap-2 whitespace-nowrap shadow-sm'>
						<PlusIcon className='h-5 w-5' />
						<span>Создать курс</span>
					</Button>
				</Link>
			</div>

			<CourseMetrics
				stats={stats}
				statusFilter={statusFilter}
				onStatusFilterChange={setStatusFilter}
			/>

			<CourseFilterBar
				searchQuery={searchQuery}
				onSearchQueryChange={setSearchQuery}
				levelFilter={levelFilter}
				onLevelFilterChange={setLevelFilter}
				sortBy={sortBy}
				onSortByChange={setSortBy}
			/>

			<div className='rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden'>
				<div className='flex items-center justify-between border-b border-slate-200 px-6 py-4'>
					<h2 className='text-lg font-semibold text-slate-900'>
						Список курсов
						<span className='ml-2 text-sm font-normal text-slate-500'>
							({filteredCourses.length} из {courses.length})
						</span>
					</h2>
				</div>

				{filteredCourses.length === 0 ? (
					<CourseEmptyState
						hasCourses={courses.length > 0}
						onResetFilters={resetFilters}
					/>
				) : (
					<ul className='divide-y divide-slate-100'>
						{filteredCourses.map((course) => (
							<CourseListItem
								key={course.id}
								course={course}
								onDeleteClick={() => setCourseToDelete(course)}
							/>
						))}
					</ul>
				)}
			</div>

			<CourseDeleteModal
				course={courseToDelete}
				isDeleting={isDeleting}
				onClose={() => setCourseToDelete(null)}
				onConfirm={handleDeleteConfirm}
			/>
		</div>
	)
}

export default CoursesPage
