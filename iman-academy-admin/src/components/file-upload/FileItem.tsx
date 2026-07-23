import { UploadFile } from '@/src/types/file-upload'

type Props = {
	file: UploadFile
	onRemove: () => void
	onUpload: () => void
}

export const FileItem = ({ file, onRemove, onUpload }: Props) => {
	return (
		<div className='rounded-[10px] border border-dashed border-color_system_blue p-4'>
			<div className='flex items-center justify-between'>
				<div>
					<p className='text-sm text-color_system_blue'>
						{file.file.name}
					</p>

					{file.status === 'success' && (
						<p className='text-xs text-color_system_green'>Success!</p>
					)}

					{file.status === 'error' && (
						<p className='text-xs text-color_system_red'>{file.error}</p>
					)}
				</div>

				<button onClick={onRemove} className='text-color_icon_black'>
					✕
				</button>
			</div>

			{file.status === 'uploading' && (
				<div className='mt-2 h-[2px] w-full bg-gray-200'>
					<div
						className='h-full bg-color_system_blue transition-all'
						style={{ width: `${file.progress}%` }}
					/>
				</div>
			)}

			{file.status === 'idle' && (
				<button
					onClick={onUpload}
					className='mt-2 text-xs text-color_system_blue hover:underline'
				>
					Start upload
				</button>
			)}
		</div>
	)
}
