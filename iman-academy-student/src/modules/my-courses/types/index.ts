export type Course = {
	id: string
	title: string
	subtitle: string
	progress: number
	isCompleted: boolean
	totalLessons: number
	completedLessons: number
	thumbnailUrl?: string | null
	level?: number | string | null
	tags?: string[]
	modulesCount?: number
	isCatalog?: boolean
}

