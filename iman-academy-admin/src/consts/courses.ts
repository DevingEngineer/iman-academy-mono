export type Course = {
	slug: string
	title: string
	category: string
	lessons: number
	status: string
}

export const TEMPORARY_COURSES: Course[] = [
	{
		slug: 'react-basics',
		title: 'Основы React',
		category: 'Frontend',
		lessons: 12,
		status: 'Опубликован',
	},
	{
		slug: 'typescript-for-beginners',
		title: 'TypeScript для начинающих',
		category: 'Frontend',
		lessons: 8,
		status: 'Черновик',
	},
	{
		slug: 'ui-ux-design',
		title: 'UI/UX дизайн',
		category: 'Design',
		lessons: 10,
		status: 'В процессе',
	},
]

export const getCourseBySlug = (slug: string) =>
	TEMPORARY_COURSES.find((course) => course.slug === slug)
