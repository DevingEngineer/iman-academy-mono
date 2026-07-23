import Image from 'next/image'

export const TeacherCard = () => {
	return (
		<div className='h-full p-[25px] flex items-center gap-6 bg-surface_card rounded-xl w550:flex-col'>
			<div className='w-[208px] h-[235px] bg-gray-200 rounded-xl shrink-0 overflow-hidden'>
				<Image
					src='https://placehold.co/208x235/png'
					alt='teacher-image'
					width={208}
					height={235}
					className='object-cover'
				/>
			</div>
			<div>
				<h3 className='body1'>Устаз Азамат Калыков</h3>
				<p className='body1 !font-normal text-secondary_text whitespace-pre-line'>
					Выпускник международного исламского университета, ученик шейха
					Абдуллаха ас-Саиди. Преподаёт акыду и фыкх более 10 лет. Его
					метод - соединять классические источники с современным подходом,
					чтобы знания становились частью жизни.
				</p>
			</div>
		</div>
	)
}
