'use client'

import { PlayIcon } from '@/src/components/icons/PlayIcon'
import Image from 'next/image'
import { useRef, useState } from 'react'

type VideoPlayerProps = {
	poster: string
	videoSrc: string
}

export const VideoPlayer = ({ poster, videoSrc }: VideoPlayerProps) => {
	const videoRef = useRef<HTMLVideoElement>(null)
	const [playing, setPlaying] = useState(false)

	const handlePlay = () => {
		setPlaying(true)
		videoRef.current?.play()
	}

	return (
		<div className='relative overflow-hidden rounded-2xl bg-black aspect-video'>
			<video
				ref={videoRef}
				src={videoSrc}
				poster={poster}
				controls={playing}
				onPlay={() => setPlaying(true)}
				onPause={() => setPlaying(false)}
				onEnded={() => setPlaying(false)}
				className='h-full w-full object-cover'
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
						<PlayIcon />
					</button>
				</div>
			)}
		</div>
	)
}
