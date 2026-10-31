'use client'

import { fetchCourses } from '@/src/lib/auth-api'
import { CourseCard } from '@/src/modules/my-courses/components/course-card/CourseCard'
import { Course } from '@/src/modules/my-courses/types'
import { useAuth } from '@/src/providers/AuthProvider'
import { useEffect, useState } from 'react'

export const AllCoursesList = () => {
	const { isLoading: isAuthLoading, isAuthenticated } = useAuth()
	const [courses, setCourses] = useState<Course[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (isAuthLoading) return

		if (!isAuthenticated) {
			setLoading(false)
			return
		}

		setLoading(true)
		fetchCourses()
			.then((data) => {
				setCourses(
					data.map((course) => ({
						id: course.id,
						title: course.title,
						subtitle: course.description ?? '',
						isCompleted: false,
						completedLessons: 0,
						totalLessons: Number(course.modulesCount),
						modulesCount: Number(course.modulesCount),
						thumbnailUrl: course.thumbnailUrl,
						level: course.level,
						tags: course.tags,
						progress: 0,
						isCatalog: true,
					}))
				)
			})
			.catch(() => setError('Не удалось загрузить курсы.'))
			.finally(() => setLoading(false))
	}, [isAuthLoading, isAuthenticated])

	if (isAuthLoading || loading) {
		return (
			<div className='pt-8 space-y-4 animate-pulse'>
				<div className='h-36 rounded-2xl bg-gray-100' />
				<div className='h-36 rounded-2xl bg-gray-100' />
			</div>
		)
	}

	if (!isAuthenticated) {
		return (
			<div className='pt-8 text-center'>
				<p className='text-secondary_text'>Войдите в аккаунт, чтобы просматривать список курсов.</p>
			</div>
		)
	}

	if (error) return <p className='pt-8 text-secondary_text'>{error}</p>

	if (courses.length === 0) {
		return <p className='pt-8 text-secondary_text'>Курсы пока не добавлены.</p>
	}

	return (
		<div className='pt-8'>
			{courses.map((course) => (
				<CourseCard {...course} key={course.id} />
			))}
		</div>
	)
}
