import { MatchMode } from './useActiveLink'

export type SidebarLink = {
	href: string
	label: string
	icon: React.FC
	match?: MatchMode
}
