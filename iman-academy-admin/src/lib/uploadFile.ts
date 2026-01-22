export const uploadFileWithProgress = (
	file: File,
	onProgress: (percent: number) => void
): Promise<void> => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		const formData = new FormData()

		formData.append('file', file)

		xhr.upload.onprogress = (event) => {
			if (!event.lengthComputable) return
			const percent = Math.round((event.loaded / event.total) * 100)
			onProgress(percent)
		}

		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				resolve()
			} else {
				reject(new Error('Upload failed'))
			}
		}

		xhr.onerror = () => reject(new Error('Network error'))

		xhr.open('POST', '/api/upload')
		xhr.send(formData)
	})
}
