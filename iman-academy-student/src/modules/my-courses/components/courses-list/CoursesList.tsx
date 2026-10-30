'use client'

import { fetchMyCourses } from '@/src/lib/auth-api'
import { Course } from '../../types'
import { CourseCard } from '../course-card/CourseCard'
import { useEffect, useState } from 'react'

export const CoursesList = () => {
	const [courses, setCourses] = useState<Course[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		fetchMyCourses()
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
					}))
				)
			})
			.catch(() => setError('Не удалось загрузить ваши курсы.'))
			.finally(() => setLoading(false))
	}, [])

	if (loading) return <p className='pt-8 text-secondary_text'>Загрузка курсов...</p>
	if (error) return <p className='pt-8 text-secondary_text'>{error}</p>
	if (courses.length === 0) {
		return <p className='pt-8 text-secondary_text'>У вас пока нет доступных курсов.</p>
	}

	return (
		<div className='pt-8'>
			{courses.map((course) => (
				<CourseCard {...course} key={course.id} />
			))}
		</div>
	)
}

