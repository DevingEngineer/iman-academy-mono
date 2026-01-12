import { EmblaCarouselType, OptionsHandlerType } from 'embla-carousel'

export const createSelectPlugin = (
	setSelectedIndex: (i: number) => void,
	setSnaps: (s: number[]) => void
) => ({
	name: 'select-plugin',
	options: {},

	init(embla: EmblaCarouselType, _optionsHandler: OptionsHandlerType) {
		const update = () => {
			setSelectedIndex(embla.selectedScrollSnap())
			setSnaps(embla.scrollSnapList())
		}

		embla.on('init', update)
		embla.on('select', update)
		embla.on('reInit', update)
		update()
	},

	destroy() {},
})
