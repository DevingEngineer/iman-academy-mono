import { usePathname } from 'next/navigation'
import { MatchMode } from '../types/useActiveLink'

type UseActiveLinkResult = {
	getActiveLink: (href: string, mode?: MatchMode) => boolean
}

export const useActiveLink = (): UseActiveLinkResult => {
	const pathname = usePathname()
	const cleanPathName  = decodeURIComponent(pathname);
	const getActiveLink = (href: string, mode: MatchMode = 'exact') => {
		if (mode === 'exact') {
			return cleanPathName === href
		}

		return cleanPathName === href || cleanPathName.startsWith(`${href}/`)
	}

	return { getActiveLink }
}
