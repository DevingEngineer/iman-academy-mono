import { Footer } from '../components/footer/Footer'
import { Header } from '../components/header/Header'

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
