import { Button } from '@/src/components/UI/Button'
import { CourseProgress } from '../course-progress/CourseProgress'
import { LessonFeedback } from '../lesson-feedback/LessonFeedback'
import { LessonList } from '../lesson-list/LessonList'
import { LessonMaterials } from '../lesson-materials/LessonMaterials'
import { VideoPlayer } from '../video-player/VideoPlayer'

export const CoursePlayer = () => {
	return (
		<section className='bg-[#FFFCF7] py-10'>
			<div className='mb-8'>
				<h4 className='h4 text-primary_text'>Экран прохождения курса</h4>
				<p className='mt-3 body1 text-secondary_text !font-normal'>
					Видео / аудио / текст + материалы и заметки
				</p>
			</div>

			<CourseProgress value={75} />

			<div className='flex gap-[92px] py-8'>
				<aside className='max-w-[464px] w-full'>
					<LessonList />
				</aside>

				<div className='max-w-[812px] w-full flex-1 col-span-12 lg:col-span-8 space-y-8'>
					<VideoPlayer />

					<div className='flex justify-end'>
						<Button variant='contained' className='max-h-[44px] px-5'>
							Следующий урок
						</Button>
					</div>
				</div>
			</div>
			<div className='ml-auto max-w-[812px] w-full'>
				<LessonMaterials />
				<LessonFeedback />
			</div>
		</section>
	)
}
