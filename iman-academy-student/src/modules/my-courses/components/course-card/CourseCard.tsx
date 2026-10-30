import { Button } from '@/src/components/UI/Button'
import { Link } from '@/src/i18n/navigation'
import { getCourseLevelLabel } from '@/src/lib/course-utils'
import Image from 'next/image'
import { CompletedIcon } from '../../icons/CompletedIcon'
import { Course } from '../../types'

type CourseCardProps = Course & {
	onOpenCertificate?: () => void
}

export const CourseCard = (props: CourseCardProps) => {
	const isCatalog = Boolean(props.isCatalog)

	return (
		<div className='mb-4 overflow-hidden rounded-[16px] border border-[#E6E8EC] bg-white transition-shadow hover:shadow-md'>
			<div className='flex gap-6 p-6 w750:flex-col'>
				{/* Thumbnail or Gradient Icon */}
				<div className='relative h-[130px] w-[200px] shrink-0 overflow-hidden rounded-xl bg-slate-100 w750:h-[160px] w750:w-full'>
					{props.thumbnailUrl ? (
						<Image
							src={props.thumbnailUrl}
							alt={props.title}
							fill
							sizes='200px'
							className='object-cover'
						/>
					) : (
						<div className='flex h-full w-full items-end bg-gradient-to-br from-[#091E3A] via-[#2F80ED] to-[#2D9EE0] p-3 text-white'>
							<span className='rounded bg-white/20 px-2 py-0.5 text-[11px] font-semibold backdrop-blur-sm'>
								{getCourseLevelLabel(props.level)}
							</span>
						</div>
					)}
				</div>

				{/* Info Area */}
				<div className='flex flex-1 flex-col justify-between'>
					<div>
						<div className='flex items-start justify-between gap-4'>
							<div>
								<div className='flex flex-wrap items-center gap-2 mb-1'>
									{props.level !== undefined && props.level !== null && (
										<span className='rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-[#2563EB]'>
											{getCourseLevelLabel(props.level)}
										</span>
									)}
									{props.tags &&
										props.tags.slice(0, 3).map((tag) => (
											<span
												key={tag}
												className='rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-secondary_text'
											>
												#{tag}
											</span>
										))}
								</div>
								<h4 className='h4 text-[18px] font-semibold text-[#0B1F33]'>
									{props.title}
								</h4>
								{props.subtitle && (
									<p className='body1 !font-normal mt-1 line-clamp-2 text-[14px] text-secondary_text'>
										{props.subtitle}
									</p>
								)}
							</div>

							{props.isCompleted && (
								<button
									onClick={props.onOpenCertificate}
									className='text-nowrap shrink-0 rounded-[10px] bg-[#F9FAFB] px-3.5 py-1.5 text-[13px] font-medium text-[#2563EB] hover:bg-blue-50'
								>
									Сертификат
								</button>
							)}
						</div>
					</div>

					{/* Action and Progress Area */}
					<div className='mt-4 pt-3 border-t border-gray-100'>
						{isCatalog ? (
							<div className='flex items-center justify-between gap-4'>
								<span className='text-xs text-secondary_text'>
									{props.modulesCount ? `Модулей: ${props.modulesCount}` : 'В каталоге'}
								</span>
								<Link href={`/courses/${props.id}`}>
									<Button
										variant='contained'
										className='max-h-[38px] rounded-[10px] px-5 text-[13px] font-medium hover:opacity-90'
									>
										Подробнее о курсе →
									</Button>
								</Link>
							</div>
						) : (
							<div className='flex items-center justify-between gap-4'>
								<div className='flex-1 max-w-md'>
									<div className='flex justify-between text-xs text-secondary_text mb-1'>
										<span>Прогресс</span>
										<span>{props.progress}%</span>
									</div>
									<div className='h-[4px] w-full rounded-full bg-border_devider overflow-hidden'>
										<div
											className='h-full rounded-full bg-[#2563EB] transition-all'
											style={{ width: `${props.progress}%` }}
										/>
									</div>
								</div>

								{!props.isCompleted ? (
									<Link href={`/courses/${props.id}`}>
										<Button
											variant='contained'
											className='max-h-[38px] rounded-[10px] px-5 text-[13px] font-medium hover:opacity-90'
										>
											Продолжить
										</Button>
									</Link>
								) : (
									<div className='flex items-center gap-2 text-sm text-green-600 font-medium'>
										<span>Завершён</span>
										<CompletedIcon />
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

