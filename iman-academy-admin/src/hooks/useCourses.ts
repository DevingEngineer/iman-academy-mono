'use client'

import { useEffect, useState } from 'react'
import { TEMPORARY_COURSES } from '../consts/courses'
import { getCourses, subscribeToCourses } from '../lib/course-storage'
import { fetchCourses } from '../lib/api'
import type { Course } from '../types/course-types'

export const useCourses = () => {
	const [courses, setCourses] = useState<Course[]>(() => getCourses() || TEMPORARY_COURSES)

	useEffect(() => {
		let mounted = true

		// Try to load fresh data from backend and fall back to local cache
		fetchCourses()
			.then((data) => {
				if (mounted) setCourses(data)
			})
			.catch(() => {
				if (mounted) setCourses(getCourses())
			})

		const unsubscribe = subscribeToCourses(() => setCourses(getCourses()))

		return () => {
			mounted = false
			unsubscribe()
		}
	}, [])

	return courses
}
