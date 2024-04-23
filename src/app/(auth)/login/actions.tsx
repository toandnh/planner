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
			// To trigger useEffect when another signin is attempted
			return 'CredentialsSignin' + new Date().getTime().toString()
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
