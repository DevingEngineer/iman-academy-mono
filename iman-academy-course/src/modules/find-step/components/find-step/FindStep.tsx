import { OclockIcon } from '@/src/components/icons/OclockIcon'
import { Button } from '@/src/components/UI/Button'
import { ConsultButton } from './UI/ConsultButton'

export const FindStep = () => {
	return (
		<section className='pt-6 pb-[35px] w750:py-5'>
			<div className='pt-8 pb-5 px-5 bg-[linear-gradient(90deg,#091E3A_0%,#091E3A_15%,#2F80ED_55%,#2D9EE0_100%)] rounded-2xl'>
				<div className='flex flex-col items-center m-auto gap-8 max-w-[789px]'>
					<div className='body3 !font-normal flex justify-center items-end whitespace-nowrap bg-hover_focus py-[8px] px-[30px] rounded-2xl'>
						<span>Консультация</span>
					</div>
					<div className='text-center px-[62px] w750:px-3'>
						<h2 className='h1 text-surface_card'>
							Найдите свой первый шаг
						</h2>
						<p className='body1 !font-normal text-surface_card'>
							Отметьте, какие темы вам ближе - система подберёт маршрут:
							с какой дисциплины начать и какие курсы пройти дальше.
						</p>
					</div>
					<div className='flex items-center gap-6 w950:flex-col'>
						<ConsultButton title='Диагностический тест' />
						<ConsultButton title='Диагностический тест' />
						<ConsultButton title='Диагностический тест' />
					</div>
					<div className='py-[23px] px-[32px] bg-surface_card rounded-3xl border border-primary_brand'>
						<p className='body1'>
							Ответьте на вопросы о своём уровне и целях — мы предложим
							готовый маршрут по курсам: с какой дисциплины начать и что
							пройти дальше.
						</p>
					</div>
					<div className='flex flex-col gap-2 items-center'>
						<Button variant='contained' className='px-5'>
							Пройти тест и получить маршурт
						</Button>
						<p className='body3 !font-normal text-surface_card flex items-center gap-1'>
							<span className='text-surface_card'>
								<OclockIcon />
							</span>
							Займёт не больше 7–10 минут
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}
