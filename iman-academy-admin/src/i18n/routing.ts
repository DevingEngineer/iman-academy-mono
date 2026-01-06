import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
	locales: ['ru', 'ky'],
	defaultLocale: 'ru',
	localeDetection: true,
	localePrefix: 'as-needed',
})
