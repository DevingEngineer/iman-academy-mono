import { SettingsNav } from '@/src/components/SettingsNav'
import { PageHeader } from '@/src/components/ui/PageHeader'

const IntegrationsPage = () => {
	return (
		<>
			<PageHeader
				title='Параметры школы'
				description='Общие сведения, брендинг, оплата, доступ и безопасность, интеграции и импорты.'
			/>
			<SettingsNav />
		</>
	)
}

export default IntegrationsPage
