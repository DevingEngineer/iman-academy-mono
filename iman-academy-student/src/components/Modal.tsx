import { AnimatePresence, motion } from 'motion/react'

type ModalProps = {
	open: boolean
	children: React.ReactNode
}

export const Modal = ({ open, children }: ModalProps) => {
	return (
		<AnimatePresence initial={false} mode='wait'>
			{open && (
				<div className='bg-white fixed inset-0 z-50'>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
					>
						{children}
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	)
}
