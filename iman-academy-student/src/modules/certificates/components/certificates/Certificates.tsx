export const Certificates = () => {
	return (
		<section className='rounded-[16px] border border-border_devider pt-6 pb-[55px] px-5'>
			<div className='flex items-start justify-between gap-[16px] w450:flex-col'>
				<div>
					<h4 className='h4 text-[24px] mb-3 font-[600] text-primary_text'>
						Сертификаты
					</h4>
					<p className='body1 !font-normal text-secondary_text'>
						Сертификаты выдаются после завершения курса и успешного
						прохождения итогового теста
					</p>
				</div>

				<span className='shrink-0 bg-system_success rounded-full bg-system_success/10 px-[14px] py-[6px] text-[13px] font-[500] text-white'>
					2 Получено
				</span>
			</div>

			<div className='mt-[28px]'>
				<div className='overflow-hidden rounded-[14px] border border-border_devider overflow-x-auto'>
					<table className='w-full text-left min-w-[630px]'>
						<thead className='bg-surface_card text-[13px] text-secondary_text'>
							<tr>
								<th className='px-[20px] py-[14px]'>ID</th>
								<th className='px-[20px] py-[14px]'>Название курса</th>
								<th className='px-[20px] py-[14px]'>Дата</th>
								<th className='px-[20px] py-[14px]'>Оценки</th>
								<th className='px-[20px] py-[14px]'>Из</th>
								<th className='px-[20px] py-[14px]'></th>
							</tr>
						</thead>

						<tbody className='text-[14px] text-primary_text'>
							<tr className='border-t border-border_devider'>
								<td className='px-[20px] py-[18px]'>01</td>
								<td className='px-[20px] py-[18px] font-[500]'>
									Чтения Корана с таджвидом
								</td>
								<td className='px-[20px] py-[18px] text-secondary_text'>
									22 авг 2025
								</td>
								<td className='px-[20px] py-[18px]'>20</td>
								<td className='px-[20px] py-[18px]'>20</td>
								<td className='px-[20px] py-[18px]'>
									<button className='flex items-center gap-[8px] text-[13px] font-[500] text-primary_brand hover:underline'>
										Скачать PDF
									</button>
								</td>
							</tr>

							<tr className='border-t border-border_devider'>
								<td className='px-[20px] py-[18px]'>02</td>
								<td className='px-[20px] py-[18px] font-[500]'>
									Основы акиды
								</td>
								<td className='px-[20px] py-[18px] text-secondary_text'>
									10 авг 2025
								</td>
								<td className='px-[20px] py-[18px]'>18</td>
								<td className='px-[20px] py-[18px]'>20</td>
								<td className='px-[20px] py-[18px]'>
									<button className='flex items-center gap-[8px] text-[13px] font-[500] text-primary_brand hover:underline'>
										Скачать PDF
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</section>
	)
}
