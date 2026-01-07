import { ButtonVariant } from '../types/button'

export const buttonBaseStyles =
	'w-full py-4 inline-flex items-center justify-center font-semibold tracking-[0.2%] transition-colors leading-[100%] duration-300 disabled:cursor-not-allowed disabled:opacity-60' as const

export const buttonVariantStyles: Record<ButtonVariant, string> = {
	default:
		'bg-surface_card rounded-full border border-border_devider text-primary_text hover:bg-accent_brand active:bg-hover_focus',
	outlined:
		'rounded-lg border-2 border-accent_brand text-white active:border-hover_focus disabled:border-system_disabled',
	contained:
		'rounded-lg bg-accent_brand active:bg-hover_focus disabled:bg-system_disabled',
} as const
