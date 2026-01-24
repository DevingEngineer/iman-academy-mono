import { Button } from '@/src/components/ui/Button'

export const PurchasesBulkActions = () => {
	return (
		<div className='flex items-center justify-between rounded-lg bg-color_bg_white border border-color_border_light mt-5 p-4'>
			<span>Выбрано: 0</span>

			<div className='flex gap-[10px]'>
				<Button variant='outlined' className='h-[29px] rounded'>
					Подтвердить
				</Button>
				<Button variant='outlined' className='h-[29px] rounded'>
					Отменить
				</Button>
				<Button variant='outlined' className='h-[29px] rounded'>
					Возврат
				</Button>
			</div>
		</div>
	)
}
