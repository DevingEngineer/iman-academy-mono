import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<Header />
			<div className='flex gap-5 pt-[22px] pb-[94px]'>
				<Sidebar />
				<main className='flex-1'>{children}</main>
			</div>
		</>
	)
}
