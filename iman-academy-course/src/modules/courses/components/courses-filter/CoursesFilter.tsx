'use client'

import { Button } from '@/src/components/Button'
import { SearchIcons } from '@/src/components/icons/SearchIcons'
import { useState } from 'react'
import { COURSES_FILTER } from '../../consts/coursesFlter'
import { CoursesFilterValue } from '../../enums/courseFilterEnum'
import { CourseDirection } from '../course-direction/CourseDirection'

export const CoursesFilter = () => {
	const [filter, setFilter] = useState<CoursesFilterValue | null>(null)

	const handleFilterOpen = (value: CoursesFilterValue) => {
		setFilter((prev) => (prev === value ? null : value))
	}

	return (
		<>
			<div className='flex gap-6 flex-wrap mt-8 w450:gap-3'>
				{COURSES_FILTER.map((item, index) => (
					<Button className='px-[33px]' key={index}>
						{item.label}
					</Button>
				))}
			</div>
			<div className='mt-12 flex items-center justify-between gap-2 w950:flex-col w950:items-start'>
				<div className='flex items-center flex-wrap gap-6'>
					<CourseDirection
						handleFilterOpen={handleFilterOpen}
						filter={filter}
						value={CoursesFilterValue.LANGUAGE}
						title='Язык'
					/>
					<CourseDirection
						handleFilterOpen={handleFilterOpen}
						filter={filter}
						value={CoursesFilterValue.DEGREE}
						title='Уровень'
					/>
					<CourseDirection
						handleFilterOpen={handleFilterOpen}
						filter={filter}
						value={CoursesFilterValue.DIRECTION}
						title='Направления'
					/>
				</div>
				<div className='w-full flex-1 max-w-[436px]'>
					<div className='relative'>
						<SearchIcons className='absolute left-[21px] top-1/2 -translate-y-1/2' />
						<input
							className=' body1 w-full outline-none border border-border_devider rounded-[13px] py-[14px] pr-[21px] pl-[50px] placeholder-[#17171780]'
							type='text'
							placeholder='Какой материал вы ищете?'
						/>
					</div>
				</div>
			</div>
		</>
	)
}
