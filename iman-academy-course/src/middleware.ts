import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export const middleware = (req: NextRequest): NextResponse => {
	const res = intlMiddleware(req)

	const localeCookie = req.cookies.get('NEXT_LOCALE')?.value
	const { locale } = req.nextUrl
	const currentLocale = ['ru', 'ky'].includes(locale)
		? locale
		: localeCookie || 'ru'

	if (!localeCookie) {
		res.cookies.set('NEXT_LOCALE', currentLocale, { path: '/' })
	}

	return res
}

export const config = {
	matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
