export const EventItem = ({ title, time }: { title: string; time: string }) => {
	return (
		<li className='text-sm border-b border-color_border_light mb-2'>
			<p className='font-medium'>{title}</p>
			<span className='text-color_text_secondary'>{time}</span>
		</li>
	)
}
