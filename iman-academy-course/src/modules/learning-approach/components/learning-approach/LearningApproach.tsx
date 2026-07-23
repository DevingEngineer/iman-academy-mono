import { SectionTitle } from '@/src/components/UI/SectionTitle'

const LEARNING_STEPS = [
	{
		title: 'Шаг за шагом',
		description:
			'Короткие уроки, конспекты и понятные примеры. Без перегруза, но с системностью',
	},
	{
		title: 'Устазы и наставники',
		description:
			'Преподаватели с подтверждённой цепочкой знаний и опытом офлайн-обучения',
	},
	{
		title: 'Практика и фидбэк',
		description:
			'Домашние задания, тесты, практика чтения Корана и разбор реальных ситуаций',
	},
	{
		title: 'Сертификаты',
		description:
			'После курса - сертификат с QR-кодом и доступ к материалам, чтобы возвращаться',
	},
]

export const LearningApproach = () => {
	return (
		<section className='pt-[112px]'>
			<SectionTitle title='Что мы учим?' />
			<h2 className='h2'>
				Соединяем классические источники, опыт устазов и современные форматы
				обучения чтобы знания переходили в практику и поклонение.
			</h2>
			<div className='flex'>
				<div className='max-w-[673px] w-full flex flex-col gap-4 pt-8'>
					{LEARNING_STEPS.map((step) => (
						<div
							key={step.title}
							className='bg-system_surface_card p-6 rounded-2xl'
						>
							<div className='relative before:absolute before:left-0 before:top-0 before:w-1 before:h-full before:bg-border_devider before:rounded-full pl-5'>
								<h4 className='h4'>Шаг за шагом</h4>
								<p className='body-medium pt-[5px] max-w-[589px]'>
									Короткие уроки, конспекты и понятные примеры. Без
									перегруза, но с системностью
								</p>
							</div>
						</div>
					))}
				</div>
				<div className='bg-system_surface_card rounded-3xl'></div>
			</div>
		</section>
	)
}
