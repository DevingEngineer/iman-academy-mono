import { Shape } from '../components/icons/Shape'

type AuthLayoutProps = {
	children: React.ReactNode
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
	return (
		<main>
			<section className='relative min-h-screen overflow-hidden'>
				<div className='absolute top-0 left-1/2 -translate-x-1/2 h-[380px]'>
					<Shape />
				</div>
				<div className='relative z-10 pt-24 px-3'>
					<div className='max-w-[500px] m-auto pl-10 pr-[24px] py-10 border border-border_devider rounded-xl bg-background_light w450:px-5 w450:py-5'>
						{children}
					</div>
				</div>
			</section>
		</main>
	)
}
