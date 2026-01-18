export const VideoPlayer = () => {
	return (
		<div className='overflow-hidden rounded-2xl bg-black aspect-video'>
			<video
				controls
				className='h-full w-full object-cover'
				src='https://www.youtube.com/embed/W-hwLlqwiKI?si=RO02MOvNX0O6mHS7'
			/>
		</div>
	)
}
