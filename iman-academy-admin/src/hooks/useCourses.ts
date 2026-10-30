'use client'

import { useCallback, useEffect, useState } from 'react'
import { TEMPORARY_COURSES } from '../consts/courses'
import { getCourses, getCourseById, subscribeToCourses } from '../lib/course-storage'
import { fetchCourses, fetchCourseById } from '../lib/api'
import type { Course } from '../types/course-types'

export const useCourses = (): Course[] => {
	const [courses, setCourses] = useState<Course[]>(() => {
		if (typeof window === 'undefined') return TEMPORARY_COURSES
		const local = getCourses()
		return local.length > 0 ? local : TEMPORARY_COURSES
	})

	const sync = useCallback(() => {
		setCourses(getCourses())
	}, [])

	useEffect(() => {
		let mounted = true

		fetchCourses()
			.then((data) => {
				if (mounted && data.length > 0) {
					setCourses(data)
				}
			})
			.catch(() => {
				if (mounted) setCourses(getCourses())
			})

		const unsubscribe = subscribeToCourses(sync)

		return () => {
			mounted = false
			unsubscribe()
		}
	}, [sync])

	return courses
}

export const useCourse = (slugOrId?: string) => {
	const clean = slugOrId ? decodeURIComponent(slugOrId) : ''
	const [course, setCourse] = useState<Course | null>(() => {
		if (!clean) return null
		return getCourseById(clean) ?? null
	})
	const [loading, setLoading] = useState<boolean>(!course)
	const [error, setError] = useState<string | null>(null)

	const refresh = useCallback(() => {
		if (!clean) return
		const cached = getCourseById(clean)
		if (cached) {
			setCourse(cached)
		}
	}, [clean])

	useEffect(() => {
		if (!clean) {
			setCourse(null)
			setLoading(false)
			return
		}

		let mounted = true
		const cached = getCourseById(clean)
		if (cached) {
			setCourse(cached)
			setLoading(false)
		} else {
			setLoading(true)
		}

		const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(clean)

		const fetcher = isUuid ? fetchCourseById(clean) : fetchCourses().then((list) => {
			const found = list.find((c) => c.slug === clean || c.id === clean)
			if (!found) throw new Error('Course not found')
			return found
		})

		fetcher
			.then((data) => {
				if (mounted) {
					setCourse(data)
					setError(null)
				}
			})
			.catch((err) => {
				if (mounted && !cached) {
					setError(err?.message || 'Не удалось загрузить данные курса')
				}
			})
			.finally(() => {
				if (mounted) setLoading(false)
			})

		const unsubscribe = subscribeToCourses(refresh)

		return () => {
			mounted = false
			unsubscribe()
		}
	}, [clean, refresh])

	return { course, loading, error, refresh }
}
