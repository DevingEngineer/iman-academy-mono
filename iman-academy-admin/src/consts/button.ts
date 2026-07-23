import { ButtonSizes, ButtonVariants } from '../types/button'

export const buttonSizes: Record<ButtonSizes, string> = {
	lg: 'button-lg py-[15px] px-7 rounded-lg',
	md: 'button-md py-[8.5px] px-4 text-sm rounded-lg',
	sm: 'button-sm py-[7.5px] px-4 text-xs rounded-[4px]',
} as const

export const buttonVariants: Record<ButtonVariants, string> = {
	contained:
		'bg-color_button_primary text-color_text_white hover:bg-color_button_hover active:bg-color_button_press active:shadow-[inset_-1px_1px_11.1px_rgba(0,0,0,0.7)] disabled:bg-color_button_disabled ',
	outlined:
		'bg-transparent border border-color_button_primary hover:border-color_button_hover active:border-color_button_press active:shadow-[inset_-1px_1px_8.3px_rgba(0,0,0,0.31)] disabled:bg-color_button_disabled disabled:border-none disabled:bg-color_button_disabled',
}

export const buttonBaseStyles =
	'flex items-center justify-center transition-colors duration-200 disabled:cursor-not-allowed' as const
