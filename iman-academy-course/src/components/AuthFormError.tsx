'use client'

import { AuthApiError, getErrorMessage } from '@/src/types/auth'

type AuthFormErrorProps = {
	error: unknown | null
	fallback: string
}

export function AuthFormError({ error, fallback }: AuthFormErrorProps) {
	if (!error) return null

	const message = getErrorMessage(error, fallback)
	const status = error instanceof AuthApiError ? error.status : null
	const rawBody = error instanceof AuthApiError ? error.rawBody : null

	return (
		<div
			role='alert'
			className='rounded-[5px] border border-system_error bg-red-50 p-3 text-sm text-red-700'
		>
			<p className='font-medium whitespace-pre-line'>{message}</p>
			{status ? <p className='mt-1 text-xs opacity-80'>HTTP {status}</p> : null}
			{rawBody && rawBody !== message ? (
				<pre className='mt-2 overflow-x-auto rounded bg-white/70 p-2 text-xs'>
					{rawBody}
				</pre>
			) : null}
		</div>
	)
}
