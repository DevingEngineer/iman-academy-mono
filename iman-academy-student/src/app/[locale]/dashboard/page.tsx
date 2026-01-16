import { DashboardNav } from '@/src/components/DashboardNav'
import { DashboardHeader } from '@/src/modules/dashboard-header'

const DashboardPage = () => {
	return (
		<>
			<DashboardHeader />
			<main className='container'>
				<DashboardNav />
			</main>
		</>
	)
}

export default DashboardPage
