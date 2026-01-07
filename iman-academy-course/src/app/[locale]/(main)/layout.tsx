import MainLayout from '@/src/layouts/MainLayout'

type RootMainLayoutProps = {
	children: Readonly<React.ReactNode>
}

const RootMainLayout = ({ children }: RootMainLayoutProps) => {
	return <MainLayout>{children}</MainLayout>
}

export default RootMainLayout
