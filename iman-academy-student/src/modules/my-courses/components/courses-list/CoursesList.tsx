import { Course } from '../../types'
import { CourseCard } from '../course-card/CourseCard'

const COURSES: Course[] = [
	{
		id: '1',
		title: 'Основы Акыда',
		subtitle: 'Базовый уровень',
		isCompleted: false,
		completedLessons: 12,
		totalLessons: 18,
		progress: 75,
	},
	{
		id: '2',
		title: 'Фикх: очищение и намаз',
		subtitle: 'Практический курс',
		isCompleted: false,
		completedLessons: 6,
		totalLessons: 12,
		progress: 75,
	},
	{
		id: '3',
		title: 'Чтение Корана с Тажуидом',
		subtitle: 'Онлайн курс',
		isCompleted: true,
		completedLessons: 15,
		totalLessons: 15,
		progress: 100,
	},
] as const

export const CoursesList = () => {
	return (
		<div className='pt-8'>
			{COURSES.map((course) => (
				<CourseCard {...course} key={course.id} />
			))}
		</div>
	)
}
