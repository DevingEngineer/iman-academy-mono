import type { StudentEnrollmentDto } from '@/src/types/auth'

export type NormalizedEnrollmentStatus =
	| 'none'
	| 'pending'
	| 'active'
	| 'rejected'
	| 'cancelled'
	| 'completed'

/**
 * Normalizes enrollment status from string or numeric enum values.
 * Backend EnrollmentStatus enum:
 * 0 = PendingRequest, 1 = Paid, 2 = Active, 3 = Cancelled
 * Some endpoints also return "Approved" or "Enrolled".
 */
export function normalizeEnrollmentStatus(
	status: number | string | null | undefined
): NormalizedEnrollmentStatus {
	if (status === null || status === undefined) return 'none'

	if (typeof status === 'number') {
		switch (status) {
			case 0:
				return 'pending'
			case 1: // Paid
			case 2: // Active
				return 'active'
			case 3: // Cancelled
				return 'cancelled'
			default:
				return 'none'
		}
	}

	const str = String(status).trim().toLowerCase()
	if (str === 'active' || str === 'approved' || str === 'enrolled' || str === 'paid') {
		return 'active'
	}
	if (str === 'pending' || str === 'pendingrequest' || str === 'requested' || str === '0') {
		return 'pending'
	}
	if (str === 'rejected' || str === 'declined') {
		return 'rejected'
	}
	if (str === 'cancelled' || str === 'canceled') {
		return 'cancelled'
	}
	if (str === 'completed') {
		return 'completed'
	}

	return 'none'
}

export function isEnrollmentActive(
	enrollment: StudentEnrollmentDto | null | undefined
): boolean {
	if (!enrollment) return false
	return normalizeEnrollmentStatus(enrollment.status) === 'active'
}

/**
 * Returns human-friendly label for CourseLevel enum.
 * 0 = Beginner, 1 = Intermediate, 2 = Advanced
 */
export function getCourseLevelLabel(
	level: number | string | null | undefined
): string {
	if (level === null || level === undefined) return 'Все уровни'

	const str = String(level).trim().toLowerCase()
	if (str === '0' || str === 'beginner' || str === 'начальный') {
		return 'Начальный'
	}
	if (str === '1' || str === 'intermediate' || str === 'средний') {
		return 'Средний'
	}
	if (str === '2' || str === 'advanced' || str === 'продвинутый') {
		return 'Продвинутый'
	}

	return String(level)
}

/**
 * Formats duration in minutes or seconds to human readable string
 */
export function formatDurationMinutes(
	minutes: number | string | null | undefined
): string | null {
	if (minutes === null || minutes === undefined) return null
	const num = Number(minutes)
	if (Number.isNaN(num) || num <= 0) return null

	if (num < 60) {
		return `${num} мин.`
	}

	const hours = Math.floor(num / 60)
	const remaining = num % 60
	return remaining > 0 ? `${hours} ч. ${remaining} мин.` : `${hours} ч.`
}

/**
 * Formats video duration in seconds to "MM:SS" or "HH:MM:SS"
 */
export function formatSecondsToTime(seconds: number | null | undefined): string {
	if (!seconds || seconds <= 0) return '00:00'
	const hrs = Math.floor(seconds / 3600)
	const mins = Math.floor((seconds % 3600) / 60)
	const secs = Math.floor(seconds % 60)

	const pad = (n: number) => String(n).padStart(2, '0')

	if (hrs > 0) {
		return `${hrs}:${pad(mins)}:${pad(secs)}`
	}
	return `${pad(mins)}:${pad(secs)}`
}

/**
 * Helper to get enrollment button props and action
 */
export function getEnrollmentActionState(
	enrollment: StudentEnrollmentDto | null,
	requestState: 'idle' | 'loading' | 'sent'
): {
	label: string
	disabled: boolean
	variant: 'primary' | 'secondary' | 'status'
	canStudy: boolean
} {
	if (requestState === 'loading') {
		return { label: 'Отправка...', disabled: true, variant: 'status', canStudy: false }
	}
	if (requestState === 'sent') {
		return { label: 'Заявка отправлена', disabled: true, variant: 'status', canStudy: false }
	}

	if (!enrollment) {
		return { label: 'Запросить доступ', disabled: false, variant: 'primary', canStudy: false }
	}

	const status = normalizeEnrollmentStatus(enrollment.status)
	if (status === 'active') {
		return {
			label: 'Продолжить обучение',
			disabled: false,
			variant: 'primary',
			canStudy: true,
		}
	}
	if (status === 'pending') {
		return {
			label: 'Заявка на рассмотрении',
			disabled: true,
			variant: 'status',
			canStudy: false,
		}
	}
	if (status === 'rejected') {
		return {
			label: 'Заявка отклонена',
			disabled: true,
			variant: 'status',
			canStudy: false,
		}
	}
	if (status === 'completed') {
		return {
			label: 'Курс завершён',
			disabled: false,
			variant: 'secondary',
			canStudy: true,
		}
	}

	return {
		label: `Статус: ${String(enrollment.status)}`,
		disabled: true,
		variant: 'status',
		canStudy: false,
	}
}
