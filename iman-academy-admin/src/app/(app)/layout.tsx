import { AppLayout } from '../../layouts/AppLayout'

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
	return <AppLayout>{children}</AppLayout>
}

export default AuthenticatedLayout
