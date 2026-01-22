import { UploadFile } from '@/src/types/file-upload'

type Props = {
	file: UploadFile
	onRemove: () => void
	onUpload: () => void
}

export const FileItem = ({ file, onRemove, onUpload }: Props) => {
	return (
		<div className='rounded-[10px] border border-dashed border-blue-400 p-4'>
			<div className='flex items-center justify-between'>
				<div>
					<p className='text-sm text-blue-600'>{file.file.name}</p>

					{file.status === 'success' && (
						<p className='text-xs text-green-500'>Success!</p>
					)}

					{file.status === 'error' && (
						<p className='text-xs text-red-500'>{file.error}</p>
					)}
				</div>

				<button
					onClick={onRemove}
					className='text-gray-400 hover:text-gray-600'
				>
					✕
				</button>
			</div>

			{file.status === 'uploading' && (
				<div className='mt-2 h-[2px] w-full bg-gray-200'>
					<div
						className='h-full bg-blue-600 transition-all'
						style={{ width: `${file.progress}%` }}
					/>
				</div>
			)}

			{file.status === 'idle' && (
				<button
					onClick={onUpload}
					className='mt-2 text-xs text-blue-600 hover:underline'
				>
					Start upload
				</button>
			)}
		</div>
	)
}
