import { PageHeader } from '../components/ui/PageHeader'
import { CoursesProgress } from '../modules/courses-progress'
import { Metrics } from '../modules/metrics'
import { RecentActivity } from '../modules/recent-activity'

const HomePage = () => {
	return (
		<>
			<PageHeader
				title='Ассаламу алейкум, Амина!'
				description='Сводка за сегодня - 11/11/2025'
			/>
			<Metrics />
			<CoursesProgress />
			<RecentActivity />
		</>
	)
}

export default HomePage
