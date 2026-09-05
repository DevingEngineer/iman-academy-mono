import { Button } from '@/src/components/UI/Button'
import { Link } from '@/src/i18n/navigation'
import { CompletedIcon } from '../../icons/CompletedIcon'
import { Course } from '../../types'

type CourseCardProps = Course & {
	onOpenCertificate?: () => void
	isCatalog?: boolean
}

export const CourseCard = (props: CourseCardProps) => {
	return (
		<div className='mb-4 rounded-[16px] border border-[#E6E8EC] bg-white px-[24px] py-[20px]'>
			<div className='flex justify-between'>
				<div>
					<h4 className='h4 text-[18px] font-semibold text-[#0B1F33]'>
						{props.title}
					</h4>
					<p className='body1 !font-normal mt-[4px] text-[14px] text-secondary_text'>
						{props.subtitle}
					</p>
				</div>

				{props.isCompleted && (
					<button
						onClick={props.onOpenCertificate}
						className='text-nowrap max-h-[38px] rounded-[10px] bg-[#F9FAFB] px-[18px] text-[14px] leading-[22px] font-medium text-[#2563EB]'
					>
						Открыть сертификат
					</button>
				)}
			</div>

			<div className='flex items-center gap-5'>
				<div className='flex flex-col justify-between w-full'>
					<div className='pb-6 w-full flex items-center gap-5 justify-between'>
						<div className='max-w-[920px] w-full'>
							<span className='text-end block text-secondary_text text-sm'>
								{props.progress}%
							</span>
							<div className='h-[4px] w-full rounded-full bg-border_devider'>
								<div
									className='h-full rounded-full bg-system_info transition-all'
									style={{ width: `${props.progress}%` }}
								/>
							</div>
						</div>
						{!props.isCompleted && (
								<Link href={`/courses/${props.id}`}>
								<Button
									variant='contained'
									className='max-h-[44px] rounded-[10px] px-5 text-[14px] font-medium hover:opacity-90'
								>
									{props.isCatalog ? 'Посмотреть' : 'Продолжить'}
								</Button>
							</Link>
						)}
						{props.isCompleted && (
							<div className='text-nowrap flex items-center gap-4 body1 !font-normal'>
								Курс завершён
								<CompletedIcon />
							</div>
						)}
					</div>
					<span className='text-[15px] leading-[20px] text-secondary_text'>
						Уроков пройдено {props.completedLessons} из{' '}
						{props.totalLessons}
					</span>
				</div>
			</div>
		</div>
	)
}
