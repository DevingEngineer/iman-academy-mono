import { Lesson } from '../../types'
import { LessonItem } from '../lesson-item/LessonItem'

const lessons: Lesson[] = [
	{ id: 1, title: 'Введение в акыду', done: true },
	{ id: 2, title: 'Вера в Аллаха', done: true },
	{ id: 3, title: 'Вера в ангелов, книги и пророков', done: false },
	{ id: 4, title: 'Вера в Судный день', done: false },
	{ id: 5, title: 'Как применять акыду в жизни', done: false },
	{ id: 6, title: 'Итоговая практика', done: false },
] as const

export const LessonList = () => {
	return (
		<ul className='space-y-3'>
			{lessons.map((lesson, index) => (
				<LessonItem key={lesson.id} index={index + 1} {...lesson} />
			))}
		</ul>
	)
}
