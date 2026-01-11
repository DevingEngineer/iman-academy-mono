import { OAuth } from '@/src/modules/oauth/components/oauth/OAuth'
import { Register } from '@/src/modules/register'

const RegisterPage = () => {
	return (
		<>
			<Register />
			<OAuth />
		</>
	)
}

export default RegisterPage
