import { notFound } from 'next/navigation'
import { CourseSidebar } from '@/src/components/CourseSidebar'
import { getCourseBySlug } from '@/src/consts/courses'

type CourseLayoutProps = {
	children: React.ReactNode
	params: Promise<{ slug: string }>
}

const CourseLayout = async ({ children, params }: CourseLayoutProps) => {
	const { slug } = await params
	const course = getCourseBySlug(slug)

	if (!course) notFound()

	return (
		<section>
			<div className='mb-6'>
				<p className='text-sm text-slate-500'>Курсы / {course.title}</p>
				<div className='mt-2 flex items-center gap-3'>
					<h1 className='text-2xl font-semibold text-slate-900'>{course.title}</h1>
					<span className='rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700'>
						{course.status}
					</span>
				</div>
			</div>
			<div className='flex items-start gap-6'>
				<CourseSidebar courseSlug={course.slug} />
				<div className='min-w-0 flex-1'>{children}</div>
			</div>
		</section>
	)
}

export default CourseLayout
