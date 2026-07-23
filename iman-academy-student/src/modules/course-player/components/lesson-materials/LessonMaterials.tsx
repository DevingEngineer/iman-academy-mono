import { DownloadIcon } from '../../icons/DownloadIcon'

export const LessonMaterials = () => {
	return (
		<div className='rounded-2xl border p-6 mb-10'>
			<h4 className='h4 text-lg font-semibold'>Материалы урока</h4>
			<p className='body1 my-3 !font-normal text-secondary_text'>
				Скачайте файлы урока. Они всегда будут доступны в “Моих курсах”
			</p>

			<div className='flex gap-3 w750:flex-col'>
				<div className='border-b border-border_devider bg-system_surface_card py-3 px-8 rounded-[7px]'>
					<button className='mx-auto flex items-center gap-1 py-[3px] px-[6px] border border-border_devider rounded-full body1 !font-normal'>
						PDF конспект <DownloadIcon />
					</button>
				</div>
				<div className='border-b border-border_devider bg-system_surface_card py-3 px-8 rounded-[7px]'>
					<button className='mx-auto flex items-center gap-1 py-[3px] px-[6px] border border-border_devider rounded-full body1 !font-normal'>
						Домашнее задание
					</button>
				</div>
				<div className='border-b border-border_devider bg-system_surface_card py-3 px-8 rounded-[7px]'>
					<button className='mx-auto flex items-center gap-1 py-[3px] px-[6px] border border-border_devider rounded-full body1 !font-normal'>
						Аудио лекции
					</button>
				</div>
			</div>
		</div>
	)
}
