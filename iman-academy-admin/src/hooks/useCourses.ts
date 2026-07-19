'use client'

import { useSyncExternalStore } from 'react'
import { TEMPORARY_COURSES } from '../consts/courses'
import { getCourses, subscribeToCourses } from '../lib/course-storage'

export const useCourses = () =>
	useSyncExternalStore(subscribeToCourses, getCourses, () => TEMPORARY_COURSES)
