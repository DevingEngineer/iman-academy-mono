import { DASHBOARD_NAV_ITEMS } from '../consts/dashboard'
import { Link } from '../i18n/navigation'

export const DashboardNav = () => {
	return (
		<ul className='flex flex-wrap gap-5 items-center max-w-[1035px] w-full justify-between py-[38px]'>
			{DASHBOARD_NAV_ITEMS.map((item) => (
				<li key={item.label}>
					<Link
						href={item.path}
						className='bg-white max-h-[54px] text-primary_text font-semibold rounded-full py-[18px] px-[43px] border border-border_devider inline-flex items-center w1050:py-3 w650:py-2'
					>
						{item.label}
					</Link>
				</li>
			))}
		</ul>
	)
}
