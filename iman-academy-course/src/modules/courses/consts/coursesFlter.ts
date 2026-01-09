import { CoursesCategoryValue } from '../enums/coursesCategoryEnum'
import { CoursesCategoryType } from '../types/coursesCategory'

export const COURSES_FILTER: CoursesCategoryType[] = [
	{
		value: CoursesCategoryValue.AQIDAH,
		label: 'Акыда',
	},
	{
		value: CoursesCategoryValue.FIQH,
		label: 'Фыкх',
	},
	{
		value: CoursesCategoryValue.Quran,
		label: 'Куран',
	},
] as const
