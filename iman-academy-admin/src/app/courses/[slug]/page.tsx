import { notFound } from 'next/navigation'
import { getCourseBySlug } from '@/src/consts/courses'

type CourseOverviewPageProps = {
	params: Promise<{ slug: string }>
}

const CourseOverviewPage = async ({ params }: CourseOverviewPageProps) => {
	const { slug } = await params
	const course = getCourseBySlug(slug)

	if (!course) notFound()

	return (
		<div className='space-y-6'>
			<div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
				<h2 className='text-lg font-semibold text-slate-900'>Описание курса</h2>
				<p className='mt-2 text-sm text-slate-500'>Основная информация и текущий статус курса.</p>
				<dl className='mt-6 grid gap-4 sm:grid-cols-3'>
					<div className='rounded-xl bg-slate-50 p-4'><dt className='text-sm text-slate-500'>Категория</dt><dd className='mt-1 font-medium text-slate-900'>{course.category}</dd></div>
					<div className='rounded-xl bg-slate-50 p-4'><dt className='text-sm text-slate-500'>Уроки</dt><dd className='mt-1 font-medium text-slate-900'>{course.lessons}</dd></div>
					<div className='rounded-xl bg-slate-50 p-4'><dt className='text-sm text-slate-500'>Статус</dt><dd className='mt-1 font-medium text-slate-900'>{course.status}</dd></div>
				</dl>
			</div>
			<div className='rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500'>
				Здесь появятся статистика курса и последние действия.
			</div>
		</div>
	)
}

export default CourseOverviewPage
