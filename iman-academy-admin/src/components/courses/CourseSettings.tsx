'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/Button'
import { useCourse } from '@/src/hooks/useCourses'
import { updateCourse, deleteCourse, slugify } from '@/src/lib/course-storage'
import { CourseGeneralFields } from './CourseGeneralFields'
import { CourseAccessFields } from './CourseAccessFields'
import { CourseDeleteModal } from './CourseDeleteModal'
import { CourseSettingsStickyBar } from './CourseSettingsStickyBar'
import { CourseSettingsTabs, SettingsTab } from './CourseSettingsTabs'
import { CourseDangerZone } from './CourseDangerZone'
import type { CourseLevel, ContentStatus } from '@/src/types/course-types'

type CourseSettingsProps = {
	courseSlug: string
}

export const CourseSettings = ({ courseSlug }: CourseSettingsProps) => {
	const router = useRouter()
	const { course, loading } = useCourse(courseSlug)

	const [activeTab, setActiveTab] = useState<SettingsTab>('all')

	const [title, setTitle] = useState('')
	const [slug, setSlug] = useState('')
	const [description, setDescription] = useState('')
	const [thumbnailUrl, setThumbnailUrl] = useState('')
	const [level, setLevel] = useState<CourseLevel>('beginner')
	const [language, setLanguage] = useState('ru')
	const [isFree, setIsFree] = useState(true)
	const [price, setPrice] = useState<number>(0)
	const [currency, setCurrency] = useState('KGS')
	const [status, setStatus] = useState<ContentStatus>('draft')
	const [tags, setTags] = useState<string[]>([])

	const [isSaving, setIsSaving] = useState(false)
	const [saveSuccess, setSaveSuccess] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)

	useEffect(() => {
		if (course) {
			setTitle(course.title || '')
			setSlug(course.slug || '')
			setDescription(course.description || '')
			setThumbnailUrl(course.thumbnailUrl || '')
			setLevel(course.level || 'beginner')
			setLanguage(course.language || 'ru')
			const free = (course.price ?? 0) <= 0
			setIsFree(free)
			setPrice(course.price || 0)
			setCurrency(course.currency || 'KGS')
			setStatus(course.status || 'draft')
			setTags(course.tags || [])
		}
	}, [course])

	const isDirty = useMemo(() => {
		if (!course) return false
		if (title !== (course.title || '')) return true
		if (slug !== (course.slug || '')) return true
		if (description !== (course.description || '')) return true
		if (thumbnailUrl !== (course.thumbnailUrl || '')) return true
		if (level !== (course.level || 'beginner')) return true
		if (language !== (course.language || 'ru')) return true
		const origFree = (course.price ?? 0) <= 0
		if (isFree !== origFree) return true
		if (!isFree && price !== (course.price || 0)) return true
		if (currency !== (course.currency || 'KGS')) return true
		if (status !== (course.status || 'draft')) return true
		const origTags = (course.tags || []).join(',')
		const currentTags = tags.join(',')
		return origTags !== currentTags
	}, [course, title, slug, description, thumbnailUrl, level, language, isFree, price, currency, status, tags])

	const handleReset = () => {
		if (!course) return
		setTitle(course.title || '')
		setSlug(course.slug || '')
		setDescription(course.description || '')
		setThumbnailUrl(course.thumbnailUrl || '')
		setLevel(course.level || 'beginner')
		setLanguage(course.language || 'ru')
		const free = (course.price ?? 0) <= 0
		setIsFree(free)
		setPrice(course.price || 0)
		setCurrency(course.currency || 'KGS')
		setStatus(course.status || 'draft')
		setTags(course.tags || [])
		setErrorMessage(null)
	}

	const saveChanges = async () => {
		if (!course) return
		const trimmedTitle = title.trim()
		if (!trimmedTitle) {
			setErrorMessage('Название курса обязательно')
			return
		}

		setIsSaving(true)
		setErrorMessage(null)
		setSaveSuccess(false)

		try {
			const finalSlug = slug.trim() ? slugify(slug) : slugify(trimmedTitle)
			const updated = {
				...course,
				title: trimmedTitle,
				slug: finalSlug,
				description: description.trim(),
				thumbnailUrl: thumbnailUrl.trim() || undefined,
				level,
				language,
				price: isFree ? 0 : Number(price) || 0,
				currency,
				status,
				tags,
				updatedAt: new Date().toISOString(),
			}

			updateCourse(updated)
			setSaveSuccess(true)
			setTimeout(() => setSaveSuccess(false), 4000)
		} catch (err: any) {
			console.error('Ошибка при сохранении курса', err)
			setErrorMessage(err?.message || 'Не удалось сохранить настройки')
		} finally {
			setIsSaving(false)
		}
	}

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		saveChanges()
	}

	const handleArchive = () => {
		if (!course) return
		setStatus('archived')
		updateCourse({
			...course,
			status: 'archived',
			updatedAt: new Date().toISOString(),
		})
		setSaveSuccess(true)
		setTimeout(() => setSaveSuccess(false), 3000)
	}

	const handleDelete = async () => {
		if (!course) return
		setIsDeleting(true)
		try {
			await deleteCourse(course.id)
			router.push('/courses')
		} catch (err) {
			console.error('Ошибка при удалении курса', err)
			alert('Не удалось удалить курс')
			setIsDeleting(false)
		}
	}

	if (loading && !course) {
		return (
			<div className='rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm'>
				Загрузка настроек курса...
			</div>
		)
	}

	if (!course) {
		return (
			<div className='rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm'>
				<p className='text-base font-semibold text-red-600'>Курс не найден</p>
			</div>
		)
	}

	return (
		<div className='space-y-6 pb-20'>
			<CourseSettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

			{saveSuccess && (
				<div className='rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800 animate-in fade-in'>
					Настройки курса успешно сохранены!
				</div>
			)}

			{errorMessage && (
				<div className='rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
					{errorMessage}
				</div>
			)}

			<form onSubmit={handleSubmit} className='space-y-6'>
				{(activeTab === 'all' || activeTab === 'general') && (
					<CourseGeneralFields
						title={title}
						onTitleChange={setTitle}
						slug={slug}
						onSlugChange={setSlug}
						description={description}
						onDescriptionChange={setDescription}
						thumbnailUrl={thumbnailUrl}
						onThumbnailUrlChange={setThumbnailUrl}
						showAutoSlugBtn={false}
					/>
				)}

				{(activeTab === 'all' || activeTab === 'access') && (
					<CourseAccessFields
						level={level}
						onLevelChange={setLevel}
						language={language}
						onLanguageChange={setLanguage}
						isFree={isFree}
						onIsFreeChange={setIsFree}
						price={price}
						onPriceChange={setPrice}
						currency={currency}
						onCurrencyChange={setCurrency}
						status={status}
						onStatusChange={setStatus}
						tags={tags}
						onTagsChange={setTags}
					/>
				)}

				{activeTab !== 'danger' && (
					<div className='flex items-center justify-end gap-3 pt-2'>
						{isDirty && (
							<button
								type='button'
								onClick={handleReset}
								disabled={isSaving}
								className='rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100'
							>
								Сбросить
							</button>
						)}
						<Button type='submit' disabled={isSaving}>
							{isSaving ? 'Сохранение...' : 'Сохранить изменения'}
						</Button>
					</div>
				)}
			</form>

			{(activeTab === 'all' || activeTab === 'danger') && (
				<CourseDangerZone
					status={status}
					onArchive={handleArchive}
					onDeleteClick={() => setShowDeleteModal(true)}
				/>
			)}

			<CourseSettingsStickyBar
				isDirty={isDirty}
				isSaving={isSaving}
				onReset={handleReset}
				onSave={saveChanges}
			/>

			<CourseDeleteModal
				course={showDeleteModal ? course : null}
				isDeleting={isDeleting}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleDelete}
			/>
		</div>
	)
}