'use client'

import { useCallback, useEffect, useState } from 'react'
import { subscribeToCourses } from '../lib/course-storage'
import { fetchCourses, fetchCourseById } from '../lib/api'
import type { Course } from '../types/course-types'

export const useCourses = (): Course[] => {
	const [courses, setCourses] = useState<Course[]>([])

	const load = useCallback(() => {
		fetchCourses()
			.then((data) => setCourses(data))
			.catch((err) => console.error('Failed to load courses from backend', err))
	}, [])

	useEffect(() => {
		load()
		const unsubscribe = subscribeToCourses(load)

		return () => {
			unsubscribe()
		}
	}, [load])

	return courses
}

export const useCourse = (slugOrId?: string) => {
	const clean = slugOrId ? decodeURIComponent(slugOrId) : ''
	const [course, setCourse] = useState<Course | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	const load = useCallback(() => {
		if (!clean) {
			setCourse(null)
			setLoading(false)
			return
		}

		setLoading(true)

		const isUuid =
			/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
				clean
			)

		const fetcher = isUuid
			? fetchCourseById(clean)
			: fetchCourses().then((list) => {
					const found = list.find((c) => c.slug === clean || c.id === clean)
					if (!found) throw new Error('Курс не найден')
					return found
			  })

		fetcher
			.then((data) => {
				setCourse(data)
				setError(null)
			})
			.catch((err) => {
				setError(err?.message || 'Не удалось загрузить данные курса')
			})
			.finally(() => {
				setLoading(false)
			})
	}, [clean])

	useEffect(() => {
		load()
		const unsubscribe = subscribeToCourses(load)

		return () => {
			unsubscribe()
		}
	}, [load])

	return { course, loading, error, refresh: load }
}
