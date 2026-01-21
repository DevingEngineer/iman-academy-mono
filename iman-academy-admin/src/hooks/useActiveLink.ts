import { usePathname } from 'next/navigation'

type UseActiveLinkResult = {
	getActiveLink: (href: string) => boolean
}

export const useActiveLink = (): UseActiveLinkResult => {
	const pathname = usePathname()
	const pathSegments = pathname.split('/').filter(Boolean)

	const getActiveLink = (href: string) =>
		pathSegments.includes(href.replace('/', '')) || pathname === href

	return { getActiveLink }
}
