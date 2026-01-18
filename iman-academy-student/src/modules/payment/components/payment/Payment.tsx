import { PaymentForm } from '../payment-form/PaymentForm'

export const Payment = () => {
	return (
		<section className='pt-8 pb-[152px]'>
			<div className='mx-auto p-5 bg-white max-w-[856px] w-full rounded-xl border border-border_devider'>
				<h4 className='h4'>Олата и доступ</h4>
				<p className='body1 !font-normal text-secondary_text my-4'>
					Чистый чек -аут. После оплаты курс добовляется в “Мои курсы”
				</p>
				<PaymentForm />
			</div>
		</section>
	)
}
