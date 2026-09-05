'use client'

import { fetchCourses } from '@/src/lib/auth-api'
import { useAuth } from '@/src/providers/AuthProvider'
import { useEffect, useState } from 'react'
import { Course } from '@/src/modules/my-courses/types'
import { CourseCard } from '@/src/modules/my-courses/components/course-card/CourseCard'

export const AllCoursesList = () => {
	const { isLoading: isAuthLoading, isAuthenticated } = useAuth()
	const [courses, setCourses] = useState<Course[]>([])
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (isAuthLoading || !isAuthenticated) return

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
						progress: 0,
						isCatalog: true,
					}))
				)
			})
			.catch(() => setError('Не удалось загрузить курсы.'))
	}, [isAuthLoading, isAuthenticated])

	if (error) return <p className='pt-8 text-secondary_text'>{error}</p>

	return (
		<div className='pt-8'>
			{courses.map((course) => (
				<CourseCard {...course} key={course.id} />
			))}
		</div>
	)
}