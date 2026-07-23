import { AuthLayout } from '@/src/layouts/AuthLayout'

type RootAuthLayoutProps = {
	children: Readonly<React.ReactNode>
}

const RootAuthLayout = ({ children }: RootAuthLayoutProps) => {
	return <AuthLayout>{children}</AuthLayout>
}

export default RootAuthLayout
