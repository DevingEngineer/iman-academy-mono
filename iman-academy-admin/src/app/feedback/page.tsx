import { PageHeader } from '@/src/components/ui/PageHeader'
import { Feedback } from '@/src/modules/feedback'

const FeedbackPage = () => {
	return (
		<>
			<PageHeader
				title='Обратная связь'
				description='Отзывы и оценки студентов по урокам и курсам'
			/>
			<Feedback />
		</>
	)
}

export default FeedbackPage
