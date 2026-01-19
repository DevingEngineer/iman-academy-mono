import { Button } from '@/src/components/UI/Button'

export const LessonFeedback = () => {
	return (
		<section className='rounded-2xl border p-6'>
			<h3 className='h4'>Обратная связь по уроку</h3>

			<p className='body1 !font-normal mt-3 mb-6 text-secondary_text'>
				Ваше мнение помогает нам улучшать качество обучения. Напишите, что
				было полезным, что можно улучшить или какие вопросы остались.
			</p>

			<textarea
				className='bg-system_surface_card min-h-[120px] w-full rounded-lg border border-border_devider px-4 py-3 text-sm outline-none placeholder:text-secondary_text'
				placeholder='Например: что было понятно/непонятно, что хотелось бы добавить, качество объяснения…'
			/>

			<div className='mt-4 flex justify-end'>
				<Button variant='contained' className='px-5 max-h-[44px]'>
					Отправить
				</Button>
			</div>
		</section>
	)
}
