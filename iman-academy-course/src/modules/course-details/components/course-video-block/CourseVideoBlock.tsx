'use client'

import { PlayIcons } from '@/src/components/icons/PlayIcons'
import Image from 'next/image'
import { useRef, useState } from 'react'

type CourseVideoBlockProps = {
	videoUrl: string
	poster: string
}

export const CourseVideoBlock = ({
	videoUrl,
	poster,
}: CourseVideoBlockProps) => {
	const videoRef = useRef<HTMLVideoElement>(null)
	const [playing, setPlaying] = useState(false)

	const handlePlay = () => {
		setPlaying(true)
		videoRef.current?.play()
	}

	return (
		<div className='relative max-w-[732px] h-[528px] rounded-2xl overflow-hidden bg-gray-200 w1250:max-w-full w1250:w-full w1250:h-auto w550:h-[235px]'>
			<video
				ref={videoRef}
				src={videoUrl}
				className='w-full h-full object-cover'
				controls={playing}
				onPlay={() => setPlaying(true)}
				onPause={() => setPlaying(false)}
				onEnded={() => setPlaying(false)}
			/>

			{!playing && (
				<div className='absolute top-0 left-0   w-full h-full flex items-center justify-center bg-black/20'>
					<Image
						src={poster}
						alt='preview'
						width={732}
						height={528}
						className='absolute inset-0 w-full h-full object-cover'
					/>

					<button
						onClick={handlePlay}
						className='relative z-10 w-20 h-20 rounded-full border-4 border-yellow-400 flex items-center justify-center shadow-lg hover:scale-105 transition'
					>
						<PlayIcons />
					</button>
				</div>
			)}
		</div>
	)
}
