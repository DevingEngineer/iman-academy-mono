import { CoursesList } from '@/src/components/courses/CoursesList'
import { SectionTitle } from '@/src/components/UI/SectionTitle'

export const PopularCourses = () => {
	return (
		<section className='pt-[36px] pb-[76px] w750:pt-[40px] w750:pb-5'>
			<SectionTitle title='Что мы учимь?' />
			<h2 className='h1 mt-5'>
				Можно начать с любого - или пройти путь целиком: от основ акыды до
				углублённого таджвида и арабского
			</h2>
			<CoursesList />
		</section>
	)
}
