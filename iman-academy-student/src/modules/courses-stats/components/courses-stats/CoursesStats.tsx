'use client'

import { fetchMyCourses } from '@/src/lib/auth-api'
import { CourseIcon } from '../../icons/CourseIcon'
import { PointIcon } from '../../icons/PointIcon'
import { CoursesStatCard } from '../courses-stat-card/CoursesStatCard'
import { useEffect, useState } from 'react'

export const CoursesStats = () => {
	const [coursesCount, setCoursesCount] = useState<number | null>(null)

	useEffect(() => {
		fetchMyCourses()
			.then((courses) => setCoursesCount(courses.length))
			.catch(() => setCoursesCount(0))
	}, [])

	return (
		<section className='py-8 grid grid-cols-2 gap-6 w750:py-6 w450:py-4'>
			<CoursesStatCard
				title='Мои курсы'
				icon={CourseIcon}
				value={coursesCount ?? '—'}
				href='/my-courses'
			/>
			<CoursesStatCard title='Баллы' icon={PointIcon} value={1200} />
		</section>
	)
}
