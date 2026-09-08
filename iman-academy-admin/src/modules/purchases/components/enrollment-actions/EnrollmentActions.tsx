'use client'

import { Button } from '@/src/components/ui/Button'
import {
	approveEnrollmentApi,
	enrollStudentsApi,
	fetchAdminEnrollmentsApi,
	type AdminEnrollment,
} from '@/src/lib/api'
import { useEffect, useState } from 'react'

type EnrollmentActionsProps = {
	mode: 'enroll' | 'approve'
}

export const EnrollmentActions = ({ mode }: EnrollmentActionsProps) => {
	const [courseId, setCourseId] = useState('')
	const [studentIds, setStudentIds] = useState('')
	const [enrollments, setEnrollments] = useState<AdminEnrollment[]>([])
	const [selectedEnrollmentIds, setSelectedEnrollmentIds] = useState<string[]>([])
	const [message, setMessage] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(mode === 'approve')

	const loadEnrollments = async () => {
		setLoading(true)
		setError(null)
		try {
			setEnrollments(await fetchAdminEnrollmentsApi())
		} catch {
			setError('Не удалось загрузить заявки на зачисление.')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (mode !== 'approve') return

		void fetchAdminEnrollmentsApi()
			.then(setEnrollments)
			.catch(() => setError('Не удалось загрузить заявки на зачисление.'))
			.finally(() => setLoading(false))
	}, [mode])

	const runAction = async (action: () => Promise<void>, successMessage: string) => {
		setLoading(true)
		setMessage(null)
		setError(null)
		try {
			await action()
			setMessage(successMessage)
		} catch {
			setError('Операция не выполнена. Проверьте идентификаторы и попробуйте ещё раз.')
		} finally {
			setLoading(false)
		}
	}

	const enrollSelectedStudents = () => {
		const ids = studentIds
			.split(/[\s,;]+/)
			.map((id) => id.trim())
			.filter(Boolean)

		if (!courseId.trim() || ids.length === 0) {
			setError('Укажите ID курса и хотя бы одного студента.')
			return
		}

		void runAction(
			() => enrollStudentsApi(courseId.trim(), ids),
			'Студенты зачислены на курс.'
		)
	}

	const toggleEnrollment = (id: string) => {
		setSelectedEnrollmentIds((current) =>
			current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]
		)
	}

	const toggleAllEnrollments = () => {
		setSelectedEnrollmentIds((current) =>
			current.length === enrollments.length ? [] : enrollments.map((enrollment) => enrollment.id)
		)
	}

	const approveSelectedEnrollments = () => {
		if (selectedEnrollmentIds.length === 0) {
			setError('Выберите хотя бы одну заявку.')
			return
		}

		void runAction(
			() => Promise.all(selectedEnrollmentIds.map(approveEnrollmentApi)).then(() => undefined),
			'Выбранные заявки подтверждены.'
		).then(() => {
			setSelectedEnrollmentIds([])
			void loadEnrollments()
		})
	}

	return (
		<div className='mt-6 grid gap-6 lg:grid-cols-2'>
			{mode === 'enroll' && <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
				<h2 className='text-lg font-semibold text-slate-900'>Зачислить студентов</h2>
				<p className='mt-1 text-sm text-slate-500'>Введите UUID курса и UUID студентов через запятую.</p>
				<div className='mt-4 space-y-3'>
					<input
						value={courseId}
						onChange={(event) => setCourseId(event.target.value)}
						placeholder='ID курса'
						className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm'
					/>
					<textarea
						value={studentIds}
						onChange={(event) => setStudentIds(event.target.value)}
						placeholder='ID студентов'
						rows={3}
						className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm'
					/>
					<Button type='button' onClick={enrollSelectedStudents} disabled={loading}>
						Зачислить выбранных
					</Button>
				</div>
			</section>}

			{mode === 'approve' && <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<div>
						<h2 className='text-lg font-semibold text-slate-900'>Заявки на зачисление</h2>
						<p className='mt-1 text-sm text-slate-500'>Выберите заявки студентов и подтвердите их одним действием.</p>
					</div>
					<div className='flex gap-3'>
						<Button type='button' onClick={approveSelectedEnrollments} disabled={loading || selectedEnrollmentIds.length === 0}>
							Подтвердить выбранные ({selectedEnrollmentIds.length})
						</Button>
						<Button type='button' variant='outlined' onClick={() => void loadEnrollments()} disabled={loading}>
							Обновить
						</Button>
					</div>
				</div>
				<div className='mt-5 overflow-x-auto'>
					<table className='w-full border-collapse text-left text-sm'>
						<thead>
							<tr className='border-b border-slate-200 text-slate-500'>
								<th className='w-10 px-3 py-3'><input type='checkbox' checked={enrollments.length > 0 && selectedEnrollmentIds.length === enrollments.length} onChange={toggleAllEnrollments} aria-label='Выбрать все заявки' /></th>
								<th className='px-3 py-3'>Студент</th>
								<th className='px-3 py-3'>Курс</th>
								<th className='px-3 py-3'>Статус</th>
								<th className='px-3 py-3'>Дата заявки</th>
							</tr>
						</thead>
						<tbody>
							{enrollments.map((enrollment) => (
								<tr key={enrollment.id} className='border-b border-slate-100 last:border-0'>
									<td className='px-3 py-3'><input type='checkbox' checked={selectedEnrollmentIds.includes(enrollment.id)} onChange={() => toggleEnrollment(enrollment.id)} aria-label={`Выбрать заявку ${enrollment.id}`} /></td>
									<td className='px-3 py-3 text-slate-900'>{enrollment.studentName || enrollment.studentEmail || enrollment.studentId || 'Не указан'}</td>
									<td className='px-3 py-3 text-slate-700'>{enrollment.courseTitle || enrollment.courseId || 'Не указан'}</td>
									<td className='px-3 py-3 text-slate-700'>{String(enrollment.status)}</td>
									<td className='px-3 py-3 text-slate-500'>{enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleString() : 'Не указана'}</td>
								</tr>
							))}
						</tbody>
					</table>
					{!loading && enrollments.length === 0 && <p className='py-8 text-center text-sm text-slate-500'>Заявок нет.</p>}
				</div>
			</section>}

			{(message || error) && (
				<p className={`lg:col-span-2 text-sm ${error ? 'text-red-600' : 'text-emerald-600'}`}>
					{error ?? message}
				</p>
			)}
		</div>
	)
}