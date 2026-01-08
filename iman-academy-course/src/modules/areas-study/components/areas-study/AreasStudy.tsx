import { Button } from '@/src/components/Button'
import { SectionTitle } from '@/src/components/UI/SectionTitle'
import { Link } from '@/src/i18n/navigation'

const AREAS_STUDY = [
	{
		id: 1,
		areas: ['Акыда', 'База веры'],
		title: 'Основы вероубеждения на понятном языке с опорой на классические источники.',
	},
	{
		id: 2,
		areas: ['Фыкх', 'Практика'],
		title: 'Намаз, пост, закят и повседневная жизнь мусульманина по шагам..',
	},
	{
		id: 3,
		areas: ['Коран и Таджвид', 'Чтение Корана'],
		title: 'Правильное чтение, правила таджвида и заучивание сур.',
	},
	{
		id: 4,
		areas: ['Арабский язык', 'Язык откровения'],
		title: 'Алфавит, чтение, базовая грамматика для понимания аятов и хадисов.',
	},
] as const

export const AreasStudy = () => {
	return (
		<section className='pt-[49px]'>
			<SectionTitle title='Направления обучения' />
			<div className='grid grid-cols-2 gap-12'>
				{AREAS_STUDY.map((lesson) => (
					<div
						key={lesson.id}
						className='py-7 px-5 rounded-[15px] bg-[linear-gradient(90deg,#091E3A_0%,#091E3A_15%,#2F80ED_55%,#2D9EE0_100%)]'
					>
						<div className='flex justify-between max-w-[240px] w-full'>
							{lesson.areas.map((a, idx) => (
								<div
									key={idx}
									className='body3 !font-normal bg-border_devider py-[7px] max-w-[104px] w-full text-center rounded-full'
								>
									{a}
								</div>
							))}
						</div>
						<h4 className='h4 text-white max-w-[347px] pt-[18px] pb-[92px]'>
							{lesson.title}
						</h4>
						<Button
							className='max-w-[175px] w-full max-h-[44px]'
							variant='contained'
						>
							<Link href={`/courses/${lesson.id}`}>Смотреть курсы</Link>
						</Button>
					</div>
				))}
			</div>
		</section>
	)
}
