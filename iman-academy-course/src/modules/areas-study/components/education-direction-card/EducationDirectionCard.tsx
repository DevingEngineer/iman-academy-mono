import { Button } from '@/src/components/UI/Button'
import { Link } from '@/src/i18n/navigation'
import Image from 'next/image'
import { AreasStudyType } from '../../types'

type EducationDirectionCardProps = AreasStudyType

export const EducationDirectionCard = ({
	id,
	title,
	image,
	areas,
}: EducationDirectionCardProps) => {
	return (
		<div className='relative flex flex-col py-7 px-5 rounded-[15px] bg-[linear-gradient(90deg,#091E3A_0%,#091E3A_15%,#2F80ED_55%,#2D9EE0_100%)] w550:p-5'>
			<div className='flex justify-between gap-[10px] max-w-[240px] w-full'>
				{areas.map((a, idx) => (
					<div
						key={idx}
						className='body3 !font-normal bg-border_devider py-[7px] max-w-[104px] w-full text-center rounded-full'
					>
						{a}
					</div>
				))}
			</div>
			<h4 className='h4 text-white sticky z-10 max-w-[347px] pt-[18px] pb-[92px] w550:pb-12'>
				{title}
			</h4>
			<Button
				className='max-w-[175px] w-full max-h-[44px] sticky z-10 mt-auto'
				variant='contained'
			>
				<Link href={`/courses/${id}/description`}>Смотреть курсы</Link>
			</Button>
			<div className='absolute bottom-0 right-0 z-0 max-w-[250px] max-h-[250px] w750:max-w-[200px] w750:max-h-[200px]'>
				<Image src={image} alt={title} width={250} height={250} />
			</div>
		</div>
	)
}
