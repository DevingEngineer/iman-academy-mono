import { AllCoursesList } from '../all-courses-list/AllCoursesList'

export const AllCourses = () => {
	return (
		<section className='py-8'>
			<div className='pt-6 px-5 pb-[22px] border border-border_devider rounded-[10px]'>
				<h4 className='h4 pb-3'>Все курсы</h4>
				<p className='body1 text-secondary_text'>
					Выберите курс и начните обучение в удобном темпе.
				</p>
				<AllCoursesList />
			</div>
		</section>
	)
}