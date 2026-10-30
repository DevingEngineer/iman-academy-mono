'use client'

import { useState } from 'react'
import { Button } from '@/src/components/ui/Button'

type CourseTagsInputProps = {
	tags: string[]
	onTagsChange: (tags: string[]) => void
}

export const CourseTagsInput = ({ tags, onTagsChange }: CourseTagsInputProps) => {
	const [tagInput, setTagInput] = useState('')

	const handleAddTag = () => {
		const trimmed = tagInput.trim().replace(/^#/, '')
		if (trimmed && !tags.includes(trimmed)) {
			onTagsChange([...tags, trimmed])
			setTagInput('')
		}
	}

	return (
		<div>
			<label className='mb-1.5 block text-sm font-medium text-slate-700'>
				Теги курса
			</label>
			<div className='flex gap-2'>
				<input
					type='text'
					value={tagInput}
					onChange={(e) => setTagInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault()
							handleAddTag()
						}
					}}
					placeholder='Добавьте тег (например: Frontend)'
					className='h-10 flex-1 rounded-lg border border-slate-300 px-3.5 text-sm text-slate-900 focus:border-color_brand_primary focus:outline-none'
				/>
				<Button type='button' variant='outlined' onClick={handleAddTag}>
					Добавить
				</Button>
			</div>
			{tags.length > 0 && (
				<div className='mt-2.5 flex flex-wrap gap-1.5'>
					{tags.map((tag) => (
						<span
							key={tag}
							className='inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700'
						>
							#{tag}
							<button
								type='button'
								onClick={() => onTagsChange(tags.filter((t) => t !== tag))}
								className='text-slate-400 hover:text-slate-600'
							>
								×
							</button>
						</span>
					))}
				</div>
			)}
		</div>
	)
}