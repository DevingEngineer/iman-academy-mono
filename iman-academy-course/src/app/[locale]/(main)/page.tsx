import { Button } from '@/src/components/Button'
import MainLayout from '../../../layouts/MainLayout'

export default function Home() {
	return (
		<MainLayout>
			<h1 className='h1'>Hero</h1>
			<Button className='border-2' variant='outlined' disabled>
				Click here
			</Button>
		</MainLayout>
	)
}
