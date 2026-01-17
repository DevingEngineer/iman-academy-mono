import { CourseCard } from '../course-card/CourseCard'

export const CoursesList = () => {
	return (
		<div className='pt-8'>
			<CourseCard
				title='Основы Акыда'
				subtitle='Базовый уровень'
				completedLessons={12}
				totalLessons={18}
				progress={75}
			/>
			<CourseCard
				title='Фикх: очищение и намаз'
				subtitle='Практический курс'
				completedLessons={6}
				totalLessons={12}
				progress={75}
			/>
			<CourseCard
				title='Чтение Корана с Тажуидом'
				subtitle='Онлайн курс'
				completedLessons={15}
				totalLessons={15}
				progress={100}
				isCompleted
			/>
		</div>
	)
}
