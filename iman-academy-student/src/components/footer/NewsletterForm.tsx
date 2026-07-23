'use client'

export const NewsletterForm = () => {
	const submitHandler = (e: React.FormEvent) => {
		e.preventDefault()
		const form = e.target as HTMLFormElement
		alert(`Subscribed with email: ${form.email.value}`)
	}

	return (
		<form
			onSubmit={submitHandler}
			className='flex rounded bg-[#F7C740] py-[1px] px-[1px] max-w-[583px] w-full w370:flex-col'
		>
			<input
				name='email'
				type='email'
				placeholder='Введите ваш email'
				className='flex-1 min-w-0 bg-transparent rounded-tl rounded-bl py-2 px-[18px] text-primary_text placeholder:text-primary_text'
			/>
			<button
				type='submit'
				className='text-nowrap text-xs font-medium leading-[138%] bg-primary_brand py-3 px-[23px] text-white rounded w550:px-2'
			>
				Подписаться сейчас
			</button>
		</form>
	)
}
