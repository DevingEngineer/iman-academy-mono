import { SectionTitle } from '@/src/components/UI/SectionTitle'
import { TeacherCard } from '../teacher-card/TeacherCard'
import { TeacherGallery } from '../teacher-gallery/TeacherGallery'

export const WhoWillTeach = () => {
	return (
		<section className='container pb-12 w750:py-5'>
			<SectionTitle title='Кто будет преподавать' />
			<div className='grid grid-cols-2 items-stretch gap-9 mt-9 w1250:grid-cols-1'>
				<TeacherCard />
				<TeacherGallery />
			</div>
		</section>
	)
}
