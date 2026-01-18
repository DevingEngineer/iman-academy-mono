type CourseProgressProps = {
	value: number
}

export const CourseProgress = ({ value }: CourseProgressProps) => {
	return (
		<div>
			<div className='mb-2 flex justify-between text-sm text-secondary_text'>
				<span>Процесс</span>
				<span>{value}%</span>
			</div>

			<div className='h-2 w-full rounded-full bg-gray-200'>
				<div
					className='h-2 rounded-full bg-blue-500 transition-all'
					style={{ width: `${value}%` }}
				/>
			</div>
		</div>
	)
}
