import { NextIntlClientProvider as IntlClientProvider } from 'next-intl'
import { ReactNode } from 'react'

type INextIntlProvider = {
	locale: string
	children: ReactNode
}

const NextIntlProvider = async ({ children, locale }: INextIntlProvider) => {
	let messages
	try {
		messages = (await import(`../../messages/${locale}.json`)).default
	} catch (error) {
		console.log(error)
	}
	return (
		<IntlClientProvider locale={locale} messages={messages}>
			{children}
		</IntlClientProvider>
	)
}

export default NextIntlProvider
