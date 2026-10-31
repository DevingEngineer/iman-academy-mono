'use client'

export type SettingsTab = 'all' | 'general' | 'access' | 'danger'

type CourseSettingsTabsProps = {
	activeTab: SettingsTab
	onTabChange: (tab: SettingsTab) => void
}

export const CourseSettingsTabs = ({
	activeTab,
	onTabChange,
}: CourseSettingsTabsProps) => {
	const tabs: { id: SettingsTab; label: string }[] = [
		{ id: 'all', label: 'Все разделы' },
		{ id: 'general', label: '1. Основная информация' },
		{ id: 'access', label: '2. Параметры и доступ' },
		{ id: 'danger', label: '3. Опасная зона' },
	]

	return (
		<div className='flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm'>
			{tabs.map((tab) => {
				const isSelected = activeTab === tab.id
				const isDanger = tab.id === 'danger'

				let style = 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
				if (isSelected && isDanger) {
					style = 'bg-red-600 text-white'
				} else if (isSelected) {
					style = 'bg-color_brand_primary text-white'
				} else if (isDanger) {
					style = 'text-red-600 hover:bg-red-50'
				}

				return (
					<button
						key={tab.id}
						type='button'
						onClick={() => onTabChange(tab.id)}
						className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${style}`}
					>
						{tab.label}
					</button>
				)
			})}
		</div>
	)
}