import { BookOpenIcon } from '../components/icons/sidebar/BookOpenIcon'
import { GraduationCapIcon } from '../components/icons/sidebar/GraduationCapIcon'
import { LayoutGridIcon } from '../components/icons/sidebar/LayoutGridIcon'
import { MessageSquareIcon } from '../components/icons/sidebar/MessageSquareIcon'
import { SettingsIcon } from '../components/icons/sidebar/SettingsIcon'
import { ShoppingBagIcon } from '../components/icons/sidebar/ShoppingBagIcon'
import { UsersIcon } from '../components/icons/sidebar/UsersIcon'
import { SidebarLink } from '../types/sidebar'

export const SIDEBAR_LINKS: SidebarLink[] = [
	{
		href: '/',
		label: 'Обзор',
		icon: LayoutGridIcon,
	},
	{
		href: '/courses',
		label: 'Курсы',
		icon: BookOpenIcon,
		match: 'parent'
	},
	{
		href: '/purchases',
		label: 'Покупки',
		icon: ShoppingBagIcon,
	},
	{
		href: '/students',
		label: 'Студенты',
		icon: UsersIcon,
	},
	{
		href: '/certificates',
		label: 'Сертификаты',
		icon: GraduationCapIcon,
	},
	{
		href: '/feedback',
		label: 'Обратная связь',
		icon: MessageSquareIcon,
	},
	{
		href: '/settings',
		label: 'Настройки',
		icon: SettingsIcon,
		match: 'parent',
	},
] as const
