import { Footer } from '../components/Footer'
import { Header } from '../components/Header'

type MainLayoutProps = {
	children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => (
	<div className='min-h-screen flex flex-col'>
		<Header />
		<main>
			<div className='container'>{children}</div>
		</main>
		<Footer />
	</div>
)

export default MainLayout
