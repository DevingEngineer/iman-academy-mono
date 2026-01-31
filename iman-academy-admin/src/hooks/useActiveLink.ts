import { usePathname } from 'next/navigation'
import { MatchMode } from '../types/useActiveLink'

type UseActiveLinkResult = {
	getActiveLink: (href: string, mode?: MatchMode) => boolean
}

export const useActiveLink = (): UseActiveLinkResult => {
	const pathname = usePathname()

	const getActiveLink = (href: string, mode: MatchMode = 'exact') => {
		if (mode === 'exact') {
			return pathname === href
		}

		return pathname === href || pathname.startsWith(`${href}/`)
	}

	return { getActiveLink }
}
