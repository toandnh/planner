'use server'

import { signIn, signOut } from '@/auth'

export async function authenticate(
	prevState: string | undefined,
	formData: FormData
) {
	try {
		await signIn('credentials', Object.fromEntries(formData))
	} catch (error) {
		if ((error as Error).message.includes('CredentialsSignin')) {
			return 'CredentialsSignin'
		}
		throw error
	}
}

export async function logout() {
	try {
		await signOut()
	} catch (error) {
		throw error
	}
}
