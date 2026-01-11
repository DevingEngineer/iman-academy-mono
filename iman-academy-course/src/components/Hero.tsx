import { Button } from './UI/Button'

export const Hero = () => {
	return (
		<section className='rounded-3xl min-h-[630px] px-4 flex flex-col items-center justify-center text-white bg-[linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url("/images/hero/bg.png")] bg-cover bg-center bg-no-repeat'>
			<h2 className='h1 max-w-[934px] text-center'>
				Путь к знаниям в исламе понятно, красиво и по шагам
			</h2>
			<p className='body1 !font-normal pt-3 pb-12 max-w-[938px] text-center'>
				Онлайн-платформа для изучения исламских дисциплин с живой поддержкой
				устазов, тестами и личным кабинетом. Без перегруза, с уважением к
				классической науке.
			</p>
			<div className='flex gap-3 pb-3 self-stretch justify-center w450:flex-col'>
				<Button
					className='max-w-[152px] w-full w450:max-w-full'
					variant='contained'
				>
					Выбрать курс
				</Button>
				<Button
					className='max-w-[300px] w-full w450:max-w-full'
					variant='outlined'
				>
					Помогите выбрать направление
				</Button>
			</div>
			<p className='body2 !font-normal'>
				📖 Курсы с нулевого и продолжающего уровня
			</p>
		</section>
	)
}
