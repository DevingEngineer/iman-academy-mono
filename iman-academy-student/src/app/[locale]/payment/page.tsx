import { Header } from '@/src/components/header/Header'
import { CoursesStats } from '@/src/modules/courses-stats'
import { Payment } from '@/src/modules/payment'
import { StudentProfileHeader } from '@/src/modules/student-profile-header'

const PaymentPage = () => {
	return (
		<>
			<Header />
			<main className='container'>
				<StudentProfileHeader />
				<CoursesStats />
				<Payment />
			</main>
		</>
	)
}

export default PaymentPage
