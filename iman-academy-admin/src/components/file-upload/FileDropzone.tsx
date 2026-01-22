'use client'

import { uploadFileWithProgress } from '@/src/lib/uploadFile'
import { UploadFile } from '@/src/types/file-upload'
import { useCallback, useRef, useState } from 'react'
import { FileItem } from './FileItem'

type FileDropzoneProps = {
	maxSizeMB?: number
	multiple?: boolean
}

export const FileDropzone = ({
	maxSizeMB = 10,
	multiple = false,
}: FileDropzoneProps) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const [files, setFiles] = useState<UploadFile[]>([])
	const [isDragging, setIsDragging] = useState(false)
	const maxSizeBytes = maxSizeMB * 1024 * 1024

	const handleFiles = useCallback(
		(selected: FileList | null) => {
			if (!selected) return

			const newFiles: UploadFile[] = Array.from(selected).map((file) => {
				if (file.size > maxSizeBytes) {
					return {
						id: crypto.randomUUID(),
						file,
						progress: 0,
						status: 'error',
						error: `Max size ${maxSizeMB} MB`,
					}
				}

				return {
					id: crypto.randomUUID(),
					file,
					progress: 0,
					status: 'idle',
				}
			})

			setFiles((prev) => [...prev, ...newFiles])
		},
		[maxSizeBytes, maxSizeMB]
	)

	const onDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault()
			setIsDragging(false)
			handleFiles(e.dataTransfer.files)
		},
		[handleFiles]
	)

	const onUploadFile = async (uploadFile: UploadFile) => {
		setFiles((prev) =>
			prev.map((f) =>
				f.id === uploadFile.id
					? { ...f, status: 'uploading', progress: 0 }
					: f
			)
		)

		try {
			await uploadFileWithProgress(uploadFile.file, (progress) => {
				setFiles((prev) =>
					prev.map((f) =>
						f.id === uploadFile.id ? { ...f, progress } : f
					)
				)
			})

			setFiles((prev) =>
				prev.map((f) =>
					f.id === uploadFile.id
						? { ...f, status: 'success', progress: 100 }
						: f
				)
			)
		} catch {
			setFiles((prev) =>
				prev.map((f) =>
					f.id === uploadFile.id
						? { ...f, status: 'error', error: 'Upload failed' }
						: f
				)
			)
		}
	}

	const removeFile = (id: string) => {
		setFiles((prev) => prev.filter((f) => f.id !== id))
	}

	return (
		<div className='w-full space-y-4'>
			<div
				onDrop={onDrop}
				onDragOver={(e) => e.preventDefault()}
				onDragEnter={() => setIsDragging(true)}
				onDragLeave={() => setIsDragging(false)}
				className={`
					rounded-[14px] border-2 border-dashed
					p-6 text-center transition
					${isDragging ? 'border-red-400 bg-red-50' : 'border-blue-400'}
				`}
			>
				<input
					ref={inputRef}
					type='file'
					multiple={multiple}
					className='hidden'
					onChange={(e) => handleFiles(e.target.files)}
				/>

				<p className='text-sm mb-2'>Перетащите файл сюда</p>
				<p className='text-xs text-gray-500 mb-4'>или</p>

				<button
					onClick={() => inputRef.current?.click()}
					className='inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700'
				>
					Выберите на устройстве
				</button>

				<p className='mt-3 text-xs text-gray-400'>
					Максимальный размер {maxSizeMB} MB
				</p>
			</div>

			{files.map((file) => (
				<FileItem
					key={file.id}
					file={file}
					onRemove={() => removeFile(file.id)}
					onUpload={() => onUploadFile(file)}
				/>
			))}
		</div>
	)
}
