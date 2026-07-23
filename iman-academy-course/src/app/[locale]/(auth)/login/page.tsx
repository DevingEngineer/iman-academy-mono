import { Login } from '@/src/modules/login'
import { OAuth } from '@/src/modules/oauth/components/oauth/OAuth'

const LoginPage = () => {
	return (
		<>
			<Login />
			<OAuth />
		</>
	)
}

export default LoginPage
