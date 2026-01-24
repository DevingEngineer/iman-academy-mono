type FiltersGroupProps = {
	children: React.ReactNode
}

export const FiltersGroup = ({ children }: FiltersGroupProps) => {
	return <div className='flex w-full max-w-[690px] gap-3'>{children}</div>
}
