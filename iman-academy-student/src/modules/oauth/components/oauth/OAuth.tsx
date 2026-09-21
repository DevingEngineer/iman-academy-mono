import { AppleIcon } from '@/src/components/icons/AppleIcon'
import { FacebookIcon } from '@/src/components/icons/FacebookIcon'
import { Button } from '@/src/components/UI/Button'
import  GoogleSignInButton from '@/src/components/GoogleSignInButton'

export const OAuth = () => {
	return (
		<div className='mt-4'>
			<div className='m-auto relative flex justify-center items-center w-fit after:absolute after:w-[21px] after:h-[1px] after:top-1/2 after:-translate-y-1/2 after:bg-border_devider after:left-[120%] before:absolute before:w-[21px] before:h-[1px] before:top-1/2 before:-translate-y-1/2 before:bg-border_devider before:right-[120%]'>
				<span>ИЛИ</span>
			</div>
			<div className='flex items-center gap-2 w550:flex-col mt-4'>
				<Button
					className='px-[54px] bg-system_info w-full'
					variant='contained'
				>
					<FacebookIcon />
				</Button>
		  		<GoogleSignInButton />
				<Button
					className='px-[54px] bg-primary_text w-full'
					variant='contained'
				>
					<AppleIcon />
				</Button>
			</div>
		</div>
	)
}
