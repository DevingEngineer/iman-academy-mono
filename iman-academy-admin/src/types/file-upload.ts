export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export type UploadFile = {
	id: string
	file: File
	error?: string
	progress: number
	status: UploadStatus
}
