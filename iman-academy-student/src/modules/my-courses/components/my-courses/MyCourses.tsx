import { CoursesList } from '../courses-list/CoursesList'

export const MyCourses = () => {
	return (
		<section className='py-8'>
			<div className='pt-6 px-5 pb-[22px] border border-border_devider rounded-[10px]'>
				<div className='flex items-start justify-between'>
					<div>
						<h4 className='h4 pb-3'>Мои курсы</h4>
						<p className='body1 text-secondary_text'>
							Продолжайте обучение в удобном темпе. Прогресс сохраняется
							автоматически.
						</p>
					</div>
					<button className='py-[7px] px-[14px] border border-border_devider body2 rounded-full !font-normal'>
						Перейти в каталог
					</button>
				</div>
				<CoursesList />
			</div>
		</section>
	)
}
