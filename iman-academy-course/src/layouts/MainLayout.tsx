import { Footer } from '../components/Footer'
import { Header } from '../components/header/Header'

type MainLayoutProps = {
	children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => (
	<div className='min-h-screen flex flex-col'>
		<Header />
		<main className='container'>{children}</main>
		<Footer />
	</div>
)

export default MainLayout
