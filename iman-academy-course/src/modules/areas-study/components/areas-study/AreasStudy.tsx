import { SectionTitle } from '@/src/components/UI/SectionTitle'
import img01 from '../../images/01.png'
import img02 from '../../images/02.png'
import img03 from '../../images/03.png'
import img04 from '../../images/04.png'
import { AreasStudyType } from '../../types'
import { EducationDirectionCard } from '../education-direction-card/EducationDirectionCard'

const AREAS_STUDY: AreasStudyType[] = [
	{
		id: 1,
		image: img01,
		areas: ['Акыда', 'База веры'],
		title: 'Основы вероубеждения на понятном языке с опорой на классические источники.',
	},
	{
		id: 2,
		image: img02,
		areas: ['Фыкх', 'Практика'],
		title: 'Намаз, пост, закят и повседневная жизнь мусульманина по шагам..',
	},
	{
		id: 3,
		image: img03,
		areas: ['Коран и Таджвид', 'Чтение Корана'],
		title: 'Правильное чтение, правила таджвида и заучивание сур.',
	},
	{
		id: 4,
		image: img04,
		areas: ['Арабский язык', 'Язык откровения'],
		title: 'Алфавит, чтение, базовая грамматика для понимания аятов и хадисов.',
	},
] as const

export const AreasStudy = () => {
	return (
		<section className='pt-[85px]'>
			<div className='container'>
				<SectionTitle title='Направления обучения' />
				<div className='grid grid-cols-2 gap-12 w850:gap-9 w750:gap-6 w550:grid-cols-1'>
					{AREAS_STUDY.map((lesson) => (
						<EducationDirectionCard key={lesson.id} {...lesson} />
					))}
				</div>
			</div>
		</section>
	)
}
